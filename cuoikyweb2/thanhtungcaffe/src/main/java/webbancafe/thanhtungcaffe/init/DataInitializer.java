package webbancafe.thanhtungcaffe.init;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import webbancafe.thanhtungcaffe.entity.User;
import webbancafe.thanhtungcaffe.entity.CafeTable;
import webbancafe.thanhtungcaffe.entity.MenuItem;
import webbancafe.thanhtungcaffe.entity.Role;
import webbancafe.thanhtungcaffe.entity.TableStatus;
import webbancafe.thanhtungcaffe.repository.UserRepository;
import webbancafe.thanhtungcaffe.repository.TableRepository;
import webbancafe.thanhtungcaffe.repository.MenuItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {
private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    @Bean
    CommandLineRunner init(UserRepository userRepo,
                           TableRepository tableRepo,
                           MenuItemRepository menuRepo,
                           PasswordEncoder encoder) {
        return args -> {
            if (userRepo.findByUsername("root").isEmpty()) {
                userRepo.save(User.builder()
                        .username("root")
                        .password(encoder.encode("rootpass"))
                        .fullName("Root User")
                        .role(Role.ROOT).build());
                        log.info(" Created default user: root/rootpass");
            }
            if (userRepo.findByUsername("admin").isEmpty()) {
                userRepo.save(User.builder()
                        .username("admin")
                        .password(encoder.encode("adminpass"))
                        .fullName("Admin")
                        .role(Role.ADMIN).build());
            }
            if (tableRepo.count() == 0) {
                tableRepo.saveAll(List.of(
                        CafeTable.builder().name("Bàn 1").capacity(4).status(TableStatus.AVAILABLE).build(),
                        CafeTable.builder().name("Bàn 2").capacity(2).status(TableStatus.AVAILABLE).build()
                ));
                log.info(" Initialized cafe tables");
            }
            if (menuRepo.count() == 0) {
                menuRepo.saveAll(List.of(
                        MenuItem.builder().name("Cà phê sữa").description("Cà phê pha phin").price(BigDecimal.valueOf(20000)).category("Coffee").build(),
                        MenuItem.builder().name("Cà phê đen").description("Đậm vị").price(BigDecimal.valueOf(18000)).category("Coffee").build()
                ));
            }
        };
    }
}