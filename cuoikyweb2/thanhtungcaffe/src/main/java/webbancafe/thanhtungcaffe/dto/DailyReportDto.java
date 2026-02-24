package webbancafe.thanhtungcaffe.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReportDto {
    private LocalDate date;
    private long totalCustomers;
    private BigDecimal totalRevenue;
    private List<OrderDetail> orders; // thêm danh sách chi tiết từng order

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDetail {
        private String customerName;
        private List<ItemDetail> items;
        private BigDecimal totalAmount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDetail {
        private String name;
        private int quantity;
        private BigDecimal price;
    }
}
