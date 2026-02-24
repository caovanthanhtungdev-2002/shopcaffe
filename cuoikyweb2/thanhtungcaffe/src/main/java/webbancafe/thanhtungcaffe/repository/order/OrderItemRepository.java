package webbancafe.thanhtungcaffe.repository.order;

import webbancafe.thanhtungcaffe.entity.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> { }
