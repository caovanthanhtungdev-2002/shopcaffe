package webbancafe.thanhtungcaffe.repository;

import webbancafe.thanhtungcaffe.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> { 
    @Query("SELECT DISTINCT m.category FROM MenuItem m WHERE m.category IS NOT NULL")
List<String> findDistinctCategories();

}
