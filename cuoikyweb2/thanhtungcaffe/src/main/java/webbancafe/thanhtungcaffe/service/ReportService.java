package webbancafe.thanhtungcaffe.service;

import webbancafe.thanhtungcaffe.dto.DailyReportDto;
import webbancafe.thanhtungcaffe.entity.order.Order;
import webbancafe.thanhtungcaffe.entity.order.OrderItem;
import webbancafe.thanhtungcaffe.entity.order.OrderStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final OrderService orderService;

    public ReportService(OrderService orderService) {
        this.orderService = orderService;
    }

   public DailyReportDto dailyReport(LocalDate date) {
    LocalDateTime start = date.atStartOfDay();
    LocalDateTime end = date.atTime(LocalTime.MAX);

    List<Order> orders = orderService.getOrdersBetween(start, end);

    long totalCustomers = orders.size();

    BigDecimal totalRevenue = orders.stream()
            .filter(o -> o.getStatus() == OrderStatus.PAID)
            .map(o -> o.getTotalAmount() == null ? BigDecimal.ZERO : o.getTotalAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    // Chi tiết từng đơn
    List<DailyReportDto.OrderDetail> orderDetails = orders.stream().map(o -> {
        List<DailyReportDto.ItemDetail> items = o.getItems().stream()
                .map(oi -> new DailyReportDto.ItemDetail(
                        oi.getMenuItem().getName(),
                        oi.getQuantity(),
                        oi.getPrice()
                )).collect(Collectors.toList());

        return new DailyReportDto.OrderDetail(
                o.getUser().getFullName(),
                items,
                o.getTotalAmount()
        );
    }).collect(Collectors.toList());

    DailyReportDto report = new DailyReportDto();
    report.setDate(date);
    report.setTotalCustomers(totalCustomers);
    report.setTotalRevenue(totalRevenue);
    report.setOrders(orderDetails);

    return report;
}

}
