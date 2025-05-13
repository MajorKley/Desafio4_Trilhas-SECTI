package desafio4.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;

@Configuration
public class SecurityBeansConfig {

    @Bean
    public AuthenticationFilter authenticationFilter(AuthenticationManager authenticationManager) {
        return new AuthenticationFilter(authenticationManager);
    }

    @Bean
    public AuthorizationFilter authorizationFilter() {
        return new AuthorizationFilter(SecurityConstants.KEY);
    }
}