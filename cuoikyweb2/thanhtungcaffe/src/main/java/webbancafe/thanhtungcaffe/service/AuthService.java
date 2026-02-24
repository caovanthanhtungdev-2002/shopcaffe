package webbancafe.thanhtungcaffe.service;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import webbancafe.thanhtungcaffe.dto.LoginRequest;
import webbancafe.thanhtungcaffe.dto.RegisterRequest;
import webbancafe.thanhtungcaffe.entity.Role;
import webbancafe.thanhtungcaffe.entity.User;
import webbancafe.thanhtungcaffe.exception.MissingFieldException;
import webbancafe.thanhtungcaffe.exception.UsernameAlreadyExistsException;
import webbancafe.thanhtungcaffe.repository.UserRepository;
import webbancafe.thanhtungcaffe.util.JwtUtil;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> register(RegisterRequest req) {

        // Kiểm tra các trường bắt buộc
        if (req.getUsername() == null || req.getUsername().isEmpty())
            throw new MissingFieldException("username");
        if (req.getPassword() == null || req.getPassword().isEmpty())
            throw new MissingFieldException("password");
        if (req.getFullName() == null || req.getFullName().isEmpty())
            throw new MissingFieldException("fullname");

        // Kiểm tra trùng username
        if (userRepo.existsByUsername(req.getUsername()))
            throw new UsernameAlreadyExistsException(req.getUsername());

        // Tạo và lưu user
        User u = User.builder()
                .username(req.getUsername())
                .password(encoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(Role.USER)
                .build();
        userRepo.save(u);

        return Map.of("id", u.getId(), "username", u.getUsername());
    }

    public Map<String, String> login(LoginRequest req) {

        if (req.getUsername() == null || req.getUsername().isEmpty())
            throw new MissingFieldException("username");
        if (req.getPassword() == null || req.getPassword().isEmpty())
            throw new MissingFieldException("password");

        User u = userRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Sai Username hoặc Password"));

        if (!encoder.matches(req.getPassword(), u.getPassword()))
            throw new RuntimeException("Sai Username hoặc Password");

        String token = jwtUtil.generateToken(u.getUsername(), u.getRole().name());
        return Map.of("token", token, "role", u.getRole().name());
    }
}
