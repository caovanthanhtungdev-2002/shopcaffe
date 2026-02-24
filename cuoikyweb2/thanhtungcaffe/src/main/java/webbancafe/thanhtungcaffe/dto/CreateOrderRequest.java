package webbancafe.thanhtungcaffe.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * DTO dùng để tạo đơn hàng mới.
 * Chuẩn hoá cho hệ thống quy mô lớn (theo phong cách enterprise).
 */
@Data
public class CreateOrderRequest {

    @NotNull(message = "tableId không được để trống")
    private Long tableId;

    @NotEmpty(message = "Danh sách món không được để trống")
    @Valid  // <--- rất quan trọng để validate từng phần tử trong List<Item>
    private List<Item> items;

    @Data
    public static class Item {

        @NotNull(message = "menuItemId không được để trống")
        private Long menuItemId;

        @NotNull(message = "Số lượng không được để trống")
        @Min(value = 1, message = "Số lượng phải >= 1")
        private Integer quantity;
    }
}
