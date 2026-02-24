package webbancafe.thanhtungcaffe.service;

import webbancafe.thanhtungcaffe.entity.MenuItem;
import webbancafe.thanhtungcaffe.repository.MenuItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class MenuService {

    //Thư mục lưu ảnh thực tế trong project
    private final String uploadDir = System.getProperty("user.dir") + "/uploads";

    private final MenuItemRepository repo;

    public MenuService(MenuItemRepository repo) {
        this.repo = repo;
    }

    // Lấy toàn bộ menu
    public List<MenuItem> findAll() {
        return repo.findAll();
    }

    // Lấy danh mục duy nhất
    public List<String> findDistinctCategories() {
        return repo.findDistinctCategories();
    }

    // Tìm theo ID
    public MenuItem findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món trong menu"));
    }

    // Lưu đơn giản (không ảnh)
    public MenuItem save(MenuItem item) {
        return repo.save(item);
    }

    // Xóa món
    public void delete(Long id) {
        repo.deleteById(id);
    }

   public MenuItem saveWithImage(MenuItem item, MultipartFile imageFile) throws IOException {
    if (imageFile != null && !imageFile.isEmpty()) {
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = imageFile.getOriginalFilename();
        File dest = new File(dir, fileName);

        //  Nếu file đã tồn tại -> thêm hậu tố để không ghi đè
        if (dest.exists()) {
            String name = fileName.substring(0, fileName.lastIndexOf('.'));
            String ext = fileName.substring(fileName.lastIndexOf('.'));
            fileName = name + "_" + System.currentTimeMillis() + ext;
            dest = new File(dir, fileName);
        }

        
        imageFile.transferTo(dest);
        item.setImage(fileName);
    }

    return repo.save(item);
}


}
