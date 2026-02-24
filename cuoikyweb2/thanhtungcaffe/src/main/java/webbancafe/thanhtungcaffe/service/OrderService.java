package webbancafe.thanhtungcaffe.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import webbancafe.thanhtungcaffe.dto.CreateOrderRequest;
import webbancafe.thanhtungcaffe.dto.OrderItemRequest;
import webbancafe.thanhtungcaffe.entity.CafeTable;
import webbancafe.thanhtungcaffe.entity.MenuItem;
import webbancafe.thanhtungcaffe.entity.TableStatus;
import webbancafe.thanhtungcaffe.entity.User;
import webbancafe.thanhtungcaffe.entity.order.Order;
import webbancafe.thanhtungcaffe.entity.order.OrderItem;
import webbancafe.thanhtungcaffe.entity.order.OrderStatus;
import webbancafe.thanhtungcaffe.repository.MenuItemRepository;
import webbancafe.thanhtungcaffe.repository.TableRepository;
import webbancafe.thanhtungcaffe.repository.UserRepository;
import webbancafe.thanhtungcaffe.repository.order.OrderItemRepository;
import webbancafe.thanhtungcaffe.repository.order.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;
    private final MenuItemRepository menuRepo;
    private final TableRepository tableRepo;
    private final UserRepository userRepo;
    private final OrderLogService logService;

    public OrderService(OrderRepository orderRepo,
                        OrderItemRepository itemRepo,
                        MenuItemRepository menuRepo,
                        TableRepository tableRepo,
                        UserRepository userRepo,
                        OrderLogService logService) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.menuRepo = menuRepo;
        this.tableRepo = tableRepo;
        this.userRepo = userRepo;
        this.logService = logService;
    }

    // ✅ Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }
    
public List<Order> getOrdersBetween(LocalDateTime start, LocalDateTime end) {
        return orderRepo.findByCreatedAtBetween(start, end);
    }
    // ✅ Lấy chi tiết đơn
    public Order getOrder(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng ID " + id));
    }

    // ✅ Tạo đơn hàng mới
    @Transactional
    public Order createOrder(String username, CreateOrderRequest req) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        CafeTable table = tableRepo.findById(req.getTableId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));

        if (table.getStatus() == TableStatus.OCCUPIED) {
            throw new RuntimeException("Bàn này đang được sử dụng");
        }

        Order order = new Order();
        order.setUser(user);
        order.setTable(table);
        order.setStatus(OrderStatus.NEW);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> items = req.getItems().stream().map(i -> {
            MenuItem m = menuRepo.findById(i.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));
            return OrderItem.builder()
                    .order(order)
                    .menuItem(m)
                    .quantity(i.getQuantity())
                    .price(m.getPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(items);
        updateTotal(order);

        Order saved = orderRepo.save(order);

        table.setStatus(TableStatus.OCCUPIED);
        tableRepo.save(table);

        logService.log(saved, "CREATE_ORDER", "Tạo đơn mới cho bàn " + table.getName());

        return saved;
    }

    // ✅ Thêm món vào đơn
    @Transactional
    public Order addItemToOrder(Long orderId, OrderItemRequest req) {
        Order order = getOrder(orderId);

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.PAID)
            throw new RuntimeException("Không thể thêm món vào đơn đã hủy hoặc đã thanh toán");

        MenuItem item = menuRepo.findById(req.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));

        OrderItem newItem = OrderItem.builder()
                .order(order)
                .menuItem(item)
                .quantity(req.getQuantity())
                .price(item.getPrice())
                .build();

        itemRepo.save(newItem);
        order.getItems().add(newItem);
        updateTotal(order);
        orderRepo.save(order);

        logService.log(order, "ADD_ITEM", "Thêm món " + item.getName());

        return order;
    }

    // ✅ Xóa 1 món khỏi đơn
    @Transactional
    public Order removeItemFromOrder(Long orderId, Long itemId) {
        Order order = getOrder(orderId);

        OrderItem item = itemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món trong đơn"));

        if (!item.getOrder().getId().equals(orderId))
            throw new RuntimeException("Món không thuộc đơn này");

        itemRepo.delete(item);
        order.getItems().removeIf(i -> i.getId().equals(itemId));
        updateTotal(order);
        orderRepo.save(order);

        logService.log(order, "REMOVE_ITEM", "Xóa món " + item.getMenuItem().getName());

        return order;
    }

    // ✅ Cập nhật trạng thái đơn
    @Transactional
    public Order updateStatus(Long orderId, String newStatus) {
        Order order = getOrder(orderId);

        OrderStatus status;
        try {
            status = OrderStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Trạng thái không hợp lệ");
        }

        order.setStatus(status);
        orderRepo.save(order);

        logService.log(order, "UPDATE_STATUS", "Cập nhật trạng thái: " + newStatus);

        return order;
    }
@Transactional
public void cancelOrder(Long orderId, String username) {
    Order order = getOrder(orderId);

    if (order.getStatus() == OrderStatus.CANCELLED)
        throw new RuntimeException("Đơn này đã bị hủy trước đó");
    if (order.getStatus() == OrderStatus.PAID)
        throw new RuntimeException("Không thể hủy đơn đã thanh toán");

    order.setStatus(OrderStatus.CANCELLED);
    orderRepo.save(order);

    // Kiểm tra bàn trước khi đổi trạng thái
    CafeTable table = order.getTable();
    if (table != null) {
        table.setStatus(TableStatus.AVAILABLE);
        tableRepo.save(table);
    }

    logService.log(order, "CANCEL_ORDER", "Đơn bị hủy bởi " + username);
}


   

    // ✅ Thanh toán đơn
    @Transactional
    public Order payOrder(Long orderId) {
        Order order = getOrder(orderId);

        if (order.getStatus() == OrderStatus.CANCELLED)
            throw new RuntimeException("Không thể thanh toán đơn đã hủy");

        order.setStatus(OrderStatus.PAID);
        orderRepo.save(order);

        CafeTable table = order.getTable();
        table.setStatus(TableStatus.AVAILABLE);
        tableRepo.save(table);

        logService.log(order, "PAY_ORDER", "Đơn đã thanh toán thành công");

        return order;
    }

    // ✅ Xóa đơn khỏi hệ thống
    @Transactional
    public void deleteOrder(Long id) {
        Order order = getOrder(id);
        orderRepo.delete(order);

        logService.log(order, "DELETE_ORDER", "Đơn đã bị xóa khỏi hệ thống");
    }

    // ✅ Tính tổng tiền
    private void updateTotal(Order order) {
        BigDecimal total = order.getItems().stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);
    }
}
