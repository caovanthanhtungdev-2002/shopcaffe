package webbancafe.thanhtungcaffe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO dùng để thêm hoặc cập nhật món trong đơn hàng.
 */
@Data
public class OrderItemRequest {

    @NotNull(message = "menuItemId không được để trống")
    private Long menuItemId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải >= 1")
    private Integer quantity;
}
