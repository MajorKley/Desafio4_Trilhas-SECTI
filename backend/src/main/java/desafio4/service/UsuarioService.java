package desafio4.service;

import desafio4.exception.BuscaVaziaRunTime;
import desafio4.exception.RegraNegocioRunTime;
import desafio4.model.entity.DTOs.UsuarioDTO;
import desafio4.model.entity.Denuncia;
import desafio4.model.entity.Usuario;
import desafio4.model.repo.UsuarioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {
    @Autowired
    UsuarioRepo repo;

    @Autowired
    DenunciaService denunciaService;

    public boolean efetuarLogin(String login, String senha) {
        Optional<Usuario> usuario = repo.findByEmail(login);
        if ((!usuario.isPresent()) || (!usuario.get().getSenha().equals(senha)))
            throw new RegraNegocioRunTime("Erro de autenticação");

        return true;
    }

    @Transactional
    public Denuncia enviarDenuncia(Denuncia denuncia) {
        return denunciaService.salvar(denuncia);
    }

    @Transactional
    public Usuario salvar(Usuario usuario) {

        verificarUsuario(usuario);

        verificarEmailUnico(usuario.getEmail(), usuario.getId_usuario());

        Usuario salvo = repo.save(usuario);

        return salvo;
    }

    @Transactional
    public Usuario atualizar(Usuario usuario) {

        verificarUsuario(usuario);
        verificarEmailUnico(usuario.getEmail(), usuario.getId_usuario());

        verificarId(usuario.getId_usuario());

        return repo.save(usuario);
    }

    public Optional<Usuario> buscarPorId(UUID id) {
        verificarId(id);
        return repo.findById(id);
    }

    public List<Usuario> buscarPorNome(String nome) {
        List<Usuario> lista = repo.findByNome(nome);

        if (lista.isEmpty()){
            throw new BuscaVaziaRunTime();
        }

        return lista;
    }

    @Transactional
    public List<Usuario> listarTodos() {
        List<Usuario> lista = repo.findAll();

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

    private void verificarUsuario(Usuario usuario) {
        if (usuario == null)
            throw new RegraNegocioRunTime("Usuário inválido");

        if ((usuario.getNome() == null) || (usuario.getNome().trim().isEmpty()))
            throw new RegraNegocioRunTime("O nome do usuário deve estar preenchido");

        if ((usuario.getEmail() == null) || (usuario.getEmail().trim().isEmpty()))
            throw new RegraNegocioRunTime("O e-mail do usuário deve estar preenchido");

        if ((usuario.getSenha() == null) || (usuario.getSenha().trim().isEmpty()))
            throw new RegraNegocioRunTime("A senha do usuário deve estar preenchida");
    }

    private void verificarEmailUnico(String email, UUID id) {
        try {
            boolean emailExiste = repo.existsByEmail(email);

            if(emailExiste){
                Usuario existente = repo.findByEmail(email).orElse(null);

                if(existente != null && !existente.getId_usuario().equals(id)) {
                    throw new RegraNegocioRunTime("O e-mail já está cadastrado. Por favor, utilize um e-mail diferente");
                }
            }
        } catch (DataIntegrityViolationException ex) {
            throw new RegraNegocioRunTime("O e-mail já está cadastrado. Por favor, utilize um e-mail diferente");
        }
    }

    //UserDetailsService

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Usuario> egresso = repo.findByEmail(email);
        if (!egresso.isPresent()) {
            throw new UsernameNotFoundException(email);
        }

        Usuario recuperado = egresso.get();

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USUARIO"));

        return new UsuarioDTO(recuperado.getId_usuario(), recuperado.getEmail(), recuperado.getSenha(), authorities);
    }

}
