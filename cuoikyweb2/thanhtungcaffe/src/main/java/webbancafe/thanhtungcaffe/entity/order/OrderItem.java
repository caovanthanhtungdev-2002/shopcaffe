package webbancafe.thanhtungcaffe.entity.order;

import webbancafe.thanhtungcaffe.entity.MenuItem;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JsonBackReference
    private Order order;


    @ManyToOne(optional = false)
    private MenuItem menuItem;

    private Integer quantity;

    private BigDecimal price;
}
