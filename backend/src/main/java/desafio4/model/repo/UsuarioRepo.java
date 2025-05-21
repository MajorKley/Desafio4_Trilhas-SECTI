package desafio4.model.repo;

import desafio4.model.entity.Denuncia;
import desafio4.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface UsuarioRepo extends JpaRepository<Usuario, UUID> {

    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%', :nomeUsuario, '%'))")
    List<Usuario> findByNome(String nomeUsuario);

    @Query("SELECT u.nome FROM Usuario u JOIN Denuncia d ON u = d.usuario WHERE d.id_denuncia = :denunciaId")
    String findNomeByDenunciaId(UUID denunciaId);

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

}
