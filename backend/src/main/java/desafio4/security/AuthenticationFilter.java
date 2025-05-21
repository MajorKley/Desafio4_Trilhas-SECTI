package desafio4.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import desafio4.model.entity.DTOs.UsuarioDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.ArrayList;
import java.util.Date;

public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    public AuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager); // Chama o construtor da classe pai
        setFilterProcessesUrl("/login"); // Define o endpoint de login
    }

    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws AuthenticationException {
        try {
            UsuarioDTO requestDTO = new ObjectMapper().readValue(request.getInputStream(), UsuarioDTO.class);
            String login = requestDTO.getEmail();
            return this.getAuthenticationManager().authenticate(
                    new UsernamePasswordAuthenticationToken(
                            login,
                            requestDTO.getSenha(),
                            new ArrayList<>()
                    )
            );
        } catch (IOException | java.io.IOException e) {
            throw new AuthenticationServiceException("Erro ao ler credenciais", e);
        }
    }

    @Override
    protected void successfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult
    ) throws IOException, java.io.IOException {

        // Obtém as roles do usuário
        UsuarioDTO usuario = (UsuarioDTO) authResult.getPrincipal();
        String id = usuario.getId().toString();
        String email = usuario.getEmail();
        String role = usuario.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        String token = Jwts.builder()
                .setSubject(id)
                .claim("email", email)
                .claim("role", role)
                .claim("id", id)
                .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(SecurityConstants.KEY)
                .compact();

        response.addHeader(SecurityConstants.HEADER_NAME, "Bearer " + token);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String jsonResponse = String.format(
                "{\"token\": \"%s\", \"user\": {\"email\": \"%s\", \"role\": \"%s\", \"id\": \"%s\"}}",
                token,
                email,
                role,
                id
        );

        response.getWriter().write(jsonResponse);

    }
}
