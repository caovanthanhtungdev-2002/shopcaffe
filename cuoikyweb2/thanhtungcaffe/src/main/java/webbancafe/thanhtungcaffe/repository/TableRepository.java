package webbancafe.thanhtungcaffe.repository;

import webbancafe.thanhtungcaffe.entity.CafeTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<CafeTable, Long> { }
