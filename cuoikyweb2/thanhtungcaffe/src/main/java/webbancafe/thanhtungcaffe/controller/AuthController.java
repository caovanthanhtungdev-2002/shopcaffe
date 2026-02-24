package webbancafe.thanhtungcaffe.controller;

import  org.springframework.http.ResponseEntity;
import  org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import webbancafe.thanhtungcaffe.dto.LoginRequest;
import webbancafe.thanhtungcaffe.dto.RegisterRequest;
import webbancafe.thanhtungcaffe.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService svc;

    public AuthController(AuthService svc) { this.svc = svc; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest req) {
        try {
            return ResponseEntity.ok(svc.register(req));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest req) {
        try {
            return ResponseEntity.ok(svc.login(req));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(ex.getMessage());
        }
    }
}
