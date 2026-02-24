package webbancafe.thanhtungcaffe.exception;

public class MissingFieldException extends RuntimeException {
    public MissingFieldException(String fieldName) {
        super("Chưa nhập " + fieldName);
    }
}
