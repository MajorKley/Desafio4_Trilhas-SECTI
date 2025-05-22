package desafio4.service;

import desafio4.exception.BuscaVaziaRunTime;
import desafio4.exception.RegraNegocioRunTime;
import desafio4.model.entity.Denuncia;
import desafio4.model.entity.Fotos;
import desafio4.model.repo.DenunciaRepo;
import desafio4.model.repo.FotosRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FotosService {
    @Autowired
    FotosRepo repo;

    @Autowired
    DenunciaRepo denunciaRepo;

    @Transactional
    public Fotos salvar(Fotos fotos) {

        verificarFotos(fotos);

        return repo.save(fotos);
    }

    @Transactional
    public Fotos atualizar(Fotos fotos) {

        verificarFotos(fotos);

        verificarId(fotos.getId_fotos());

        return repo.save(fotos);
    }

    public Optional<Fotos> buscarPorId(UUID id) {
        verificarId(id);
        return repo.findById(id);
    }

    public Optional<Fotos> buscarPorDenuncia(UUID id) {
        Denuncia denuncia = denunciaRepo.findById(id).get();
        try {
            Optional<Fotos> fotos = repo.findFotosByDenuncia(denuncia);
            return fotos;
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Transactional
    public List<Fotos> listarTodos() {
        List<Fotos> lista = repo.findAll();

        if (lista.isEmpty()){
            throw new BuscaVaziaRunTime();
        }

        return lista;
    }

    @Transactional
    public void deletar(UUID id){
        verificarId(id);
        repo.deleteById(id);
    }

    private void verificarId(UUID id) {
        if (id == null)
            throw new RegraNegocioRunTime("ID inválido");
        if (!repo.existsById(id)){
            throw new RegraNegocioRunTime("ID não encontrado");
        }
    }

    private void verificarFotos(Fotos fotos) {
        if (fotos == null)
            throw new RegraNegocioRunTime("Fotos inválidas");
    }

}
