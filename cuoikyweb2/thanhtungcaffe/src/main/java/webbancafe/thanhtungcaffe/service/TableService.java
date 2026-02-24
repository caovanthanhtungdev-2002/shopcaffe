package webbancafe.thanhtungcaffe.service;

import webbancafe.thanhtungcaffe.entity.CafeTable;
import webbancafe.thanhtungcaffe.entity.TableStatus;
import webbancafe.thanhtungcaffe.repository.TableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {

    private final TableRepository repo;

    public TableService(TableRepository repo) {
        this.repo = repo;
    }

    public List<CafeTable> findAll() {
        return repo.findAll();
    }
public CafeTable update(CafeTable table) {
    return repo.save(table);
}

    public CafeTable create(CafeTable t) {
        t.setStatus(TableStatus.AVAILABLE);
        return repo.save(t);
    }

    public CafeTable updateStatus(Long id, TableStatus status) {
        CafeTable t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn có ID: " + id));
        t.setStatus(status);
        return repo.save(t);
    }

    public CafeTable findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn có ID: " + id));
    }

    
    public boolean deleteById(Long id) {
        if (!repo.existsById(id)) {
            return false; 
        }
        try {
            repo.deleteById(id);
            return true;
        } catch (Exception e) {
            
            return false;
        }
    }
}
