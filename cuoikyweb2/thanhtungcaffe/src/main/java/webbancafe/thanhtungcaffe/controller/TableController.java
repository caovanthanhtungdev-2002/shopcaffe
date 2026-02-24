package webbancafe.thanhtungcaffe.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import webbancafe.thanhtungcaffe.entity.User;
import webbancafe.thanhtungcaffe.entity.CafeTable;
import webbancafe.thanhtungcaffe.service.TableService;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    private final TableService svc;

    public TableController(TableService svc) {
        this.svc = svc;
    }

    // --- Lấy danh sách tất cả bàn ---
    @GetMapping
    public List<CafeTable> all(@AuthenticationPrincipal User user) {
        return svc.findAll();
    }

    // --- Thêm bàn mới ---
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ROOT')")
    public ResponseEntity<?> create(@RequestBody @Valid CafeTable t) {
        return ResponseEntity.ok(svc.create(t));
    }

    // --- Cập nhật bàn (tên, sức chứa, trạng thái) ---
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ROOT')")
    public ResponseEntity<?> updateTable(@PathVariable Long id, @RequestBody CafeTable updatedTable) {
        CafeTable existing = svc.findById(id);
        if (existing == null) {
            return ResponseEntity.badRequest().body("Bàn không tồn tại");
        }

        existing.setName(updatedTable.getName());
        existing.setCapacity(updatedTable.getCapacity());
        existing.setStatus(updatedTable.getStatus());

        CafeTable saved = svc.update(existing); 
        return ResponseEntity.ok(saved);
    }

    // --- Xóa bàn ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ROOT')")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        boolean deleted = svc.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok("Xóa bàn thành công!");
        } else {
            return ResponseEntity.badRequest().body("Không thể xóa bàn — có thể bàn không tồn tại hoặc đang được sử dụng.");
        }
    }
}
