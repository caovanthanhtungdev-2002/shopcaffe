package webbancafe.thanhtungcaffe.controller;

import webbancafe.thanhtungcaffe.dto.DailyReportDto;
import webbancafe.thanhtungcaffe.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/report")
public class ReportController {

    private final ReportService svc;

    public ReportController(ReportService svc) { this.svc = svc; }

    @GetMapping("/daily")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ROOT')")
    public ResponseEntity<?> daily(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            DailyReportDto dto = svc.dailyReport(date);
            return ResponseEntity.ok(dto);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
