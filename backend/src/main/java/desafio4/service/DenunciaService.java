package desafio4.service;

import desafio4.exception.BuscaVaziaRunTime;
import desafio4.exception.RegraNegocioRunTime;
import desafio4.model.entity.Denuncia;
import desafio4.model.entity.Usuario;
import desafio4.model.repo.DenunciaRepo;
import desafio4.model.repo.UsuarioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DenunciaService {
    @Autowired
    DenunciaRepo repo;

    @Autowired
    UsuarioRepo usuarioRepo;

    @Transactional
    public Denuncia salvar(Denuncia denuncia) {

        verificarDenuncia(denuncia);

        Denuncia salvo = repo.save(denuncia);

        return salvo;
    }

    @Transactional
    public Denuncia atualizar(Denuncia denuncia) {

        verificarDenuncia(denuncia);

        verificarId(denuncia.getId_denuncia());

        return repo.save(denuncia);
    }

    public Optional<Denuncia> buscarPorId(UUID id) {
        verificarId(id);
        return repo.findById(id);
    }

    public List<Denuncia> buscarPorTitulo(String titulo) {
        List<Denuncia> lista = repo.findByTitulo(titulo);

        if (lista.isEmpty()){
            throw new BuscaVaziaRunTime();
        }

        return lista;
    }

    public List<Denuncia> buscarPorUsuario(UUID id) {
        Usuario usuario = usuarioRepo.findById(id).get();
        List<Denuncia> lista = repo.findByUsuario(usuario);

        if (lista.isEmpty()){
            throw new BuscaVaziaRunTime();
        }

        return lista;
    }

    @Transactional
    public List<Denuncia> listarTodos() {
        List<Denuncia> lista = repo.findAll();

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

    private void verificarDenuncia(Denuncia denuncia) {
        if (denuncia == null)
            throw new RegraNegocioRunTime("Denuncia inválida");

        if ((denuncia.getTitulo() == null) || (denuncia.getTitulo().trim().isEmpty()))
            throw new RegraNegocioRunTime("O título da denúncia deve ser preenchido");

        if ((denuncia.getDescricao() == null) || (denuncia.getDescricao().trim().isEmpty()))
            throw new RegraNegocioRunTime("A descrição da denúncia deve estar preenchida");

        if (denuncia.getLatitude() == null)
            throw new RegraNegocioRunTime("O local da denúncia deve estar preenchido");

        if (denuncia.getLongitude() == null)
            throw new RegraNegocioRunTime("O local da denúncia deve estar preenchido");
    }
}
