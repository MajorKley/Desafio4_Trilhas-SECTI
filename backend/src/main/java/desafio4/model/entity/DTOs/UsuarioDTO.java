package desafio4.model.entity.DTOs;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO implements UserDetails {
    private UUID id;
    private String nome;
    @Email(message = "E-mail inválido. Verifique o formato")
    private String email;
    private String senha;
    private String descricao;
    private Collection<? extends GrantedAuthority> authorities;

    public UsuarioDTO(UUID id, String login, String senha, List<SimpleGrantedAuthority> authorities) {
        this.id = id;
        this.email = login;
        this.senha = senha;
        this.authorities = authorities;
    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return nome;
    }
}
