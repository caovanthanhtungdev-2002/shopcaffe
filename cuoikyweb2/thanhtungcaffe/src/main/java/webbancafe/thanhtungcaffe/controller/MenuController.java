package webbancafe.thanhtungcaffe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import webbancafe.thanhtungcaffe.entity.MenuItem;
import webbancafe.thanhtungcaffe.service.MenuService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService svc;

    public MenuController(MenuService svc) {
        this.svc = svc;
    }

    @GetMapping
    public List<MenuItem> all() {
        return svc.findAll();
    }
@GetMapping("/categories")
public ResponseEntity<List<String>> getCategories() {
    List<String> categories = svc.findDistinctCategories();
    return ResponseEntity.ok(categories);
}

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ROOT')")
    public ResponseEntity<?> create(
            @RequestPart("menu") MenuItem item,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {
        MenuItem saved = svc.saveWithImage(item, imageFile);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ROOT')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestPart("menu") MenuItem item,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        item.setId(id);
        // Nếu không có ảnh mới, giữ lại ảnh cũ
        MenuItem oldItem = svc.findById(id);
        if (imageFile == null || imageFile.isEmpty()) {
            item.setImage(oldItem.getImage());
        }
  

        MenuItem updated = svc.saveWithImage(item, imageFile);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ROOT')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.ok().build();
    }
}
