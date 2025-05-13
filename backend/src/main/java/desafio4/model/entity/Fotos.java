package desafio4.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "FOTOS")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Fotos implements Serializable{
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @EqualsAndHashCode.Include
    private UUID id_fotos;

    @Column(columnDefinition = "TEXT")
    private String foto1;

    @Column(columnDefinition = "TEXT")
    private String foto2;

    @Column(columnDefinition = "TEXT")
    private String foto3;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_denuncia")
    private Denuncia denuncia;
}
