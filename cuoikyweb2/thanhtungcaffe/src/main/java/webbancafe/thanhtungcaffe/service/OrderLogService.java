package webbancafe.thanhtungcaffe.service;

import org.springframework.stereotype.Service;
import webbancafe.thanhtungcaffe.entity.order.Order;
import java.time.LocalDateTime;

@Service
public class OrderLogService {
    public void log(Order order, String action, String message) {
        System.out.printf("[%s] Đơn #%d - %s: %s%n",
                LocalDateTime.now(), order.getId(), action, message);
        // (Sau này có thể lưu vào bảng logs hoặc gửi Kafka)
    }
}
