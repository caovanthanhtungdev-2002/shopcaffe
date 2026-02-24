package webbancafe.thanhtungcaffe.dto;

import java.time.LocalDateTime;

public class ErrorResponse {
    private String status;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse(String message) {
        this.status = "error";
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    // Getter
    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
