package desafio4.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import desafio4.model.entity.ENUMs.Status;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "DENUNCIA")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Denuncia implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private UUID id_denuncia;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonBackReference
    private Usuario usuario;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @EqualsAndHashCode.Include
    private Status status = Status.ENVIADO;

    @Column
    @EqualsAndHashCode.Include
    private LocalDate data = LocalDate.now();

    @OneToOne(mappedBy = "denuncia", cascade = CascadeType.ALL)
    private Fotos fotos;
}
