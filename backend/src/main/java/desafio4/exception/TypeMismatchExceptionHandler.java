package desafio4.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.UUID;

@ControllerAdvice
public class TypeMismatchExceptionHandler {

    @ExceptionHandler (MethodArgumentTypeMismatchException.class)
    public ResponseEntity handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        if (ex.getRequiredType() == UUID.class) {
            return ResponseEntity.badRequest().body("ID Inválido");
        }
        return ResponseEntity.badRequest().body("Parâmetro Inválido");
    }
}
