package desafio4.model.entity.DTOs;

import com.fasterxml.jackson.annotation.JsonFormat;
import desafio4.model.entity.ENUMs.Status;
import desafio4.model.entity.Fotos;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class EmailDTO {
    private String to;
    private String subject;
    private String content;
}



