package webbancafe.thanhtungcaffe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import webbancafe.thanhtungcaffe.dto.CreateOrderRequest;
import webbancafe.thanhtungcaffe.dto.OrderItemRequest;
import webbancafe.thanhtungcaffe.service.OrderService;
import java.security.Principal;
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService svc;

    public OrderController(OrderService svc) {
        this.svc = svc;
    }

    // Lấy tất cả đơn hàng
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(svc.getAllOrders());
    }

    //Lấy chi tiết 1 đơn
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return ResponseEntity.ok(svc.getOrder(id));
    }

    //Tạo đơn mới
    @PostMapping
    public ResponseEntity<?> create(Authentication auth, @Valid @RequestBody CreateOrderRequest req) {
        String username = auth.getName();
        return ResponseEntity.ok(svc.createOrder(username, req));
    }

    // Thêm món vào đơn
    @PostMapping("/{id}/add-item")
    public ResponseEntity<?> addItem(@PathVariable Long id, @Valid @RequestBody OrderItemRequest req) {
        return ResponseEntity.ok(svc.addItemToOrder(id, req));
    }

    // Xóa 1 món khỏi đơn
    @DeleteMapping("/{orderId}/remove-item/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long orderId, @PathVariable Long itemId) {
        return ResponseEntity.ok(svc.removeItemFromOrder(orderId, itemId));
    }

    // Cập nhật trạng thái đơn (bắt đầu pha, hoàn tất, v.v.)
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @PathVariable String status) {
        return ResponseEntity.ok(svc.updateStatus(id, status));
    }

   @PutMapping("/{id}/cancel")
@PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
public ResponseEntity<?> cancelOrder(@PathVariable Long id, Principal principal) {
    svc.cancelOrder(id, principal.getName());
    return ResponseEntity.ok("Đã hủy đơn hàng thành công!");
}


    // Thanh toán đơn
    @PutMapping("/{id}/pay")
    public ResponseEntity<?> pay(@PathVariable Long id) {
        return ResponseEntity.ok(svc.payOrder(id));
    }


    //  Xóa đơn khỏi hệ thống
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        svc.deleteOrder(id);
        return ResponseEntity.ok("Đã xóa đơn hàng thành công");
    }
}
