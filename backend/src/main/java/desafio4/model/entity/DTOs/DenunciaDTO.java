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
public class DenunciaDTO {
    private String titulo;
    private String descricao;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private boolean anonimo;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;
    private Status status;
    private Set<Fotos> fotos;
}



