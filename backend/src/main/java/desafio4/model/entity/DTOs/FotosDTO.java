package desafio4.model.entity.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FotosDTO {
    private String foto1;
    private String foto2;
    private String foto3;
}



