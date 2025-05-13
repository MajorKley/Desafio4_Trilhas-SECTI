package desafio4.model.repo;

import desafio4.model.entity.Fotos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FotosRepo extends JpaRepository<Fotos, UUID> {

}
