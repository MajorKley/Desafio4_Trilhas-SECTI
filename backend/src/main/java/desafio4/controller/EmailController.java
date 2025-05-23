package desafio4.controller;

import desafio4.model.entity.DTOs.EmailDTO;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/enviar-email")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> enviarEmailComAnexos(
            @RequestPart("dados") @Valid EmailDTO emailRequest,
            @RequestPart(value = "anexos", required = false) List<MultipartFile> anexos) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(emailRequest.getTo());
            helper.setSubject(emailRequest.getSubject());
            helper.setText(emailRequest.getContent(), true);

            // Adicionar anexos
            if (anexos != null && !anexos.isEmpty()) {
                for (MultipartFile anexo : anexos) {
                    helper.addAttachment(anexo.getOriginalFilename(), anexo);
                }
            }

            mailSender.send(message);
            return ResponseEntity.ok("E-mail enviado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}