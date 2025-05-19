package desafio4.controller;

import desafio4.exception.BuscaVaziaRunTime;
import desafio4.exception.RegraNegocioRunTime;
import desafio4.model.entity.DTOs.DenunciaDTO;
import desafio4.model.entity.Denuncia;
import desafio4.model.entity.ENUMs.Status;
import desafio4.service.DenunciaService;
import desafio4.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/denuncia")
public class DenunciaController {
    @Autowired
    DenunciaService denunciaService;

    @Autowired
    private UsuarioService usuarioService;

    // -------------------- endpoints CRUD ---------------------

    @PostMapping("{id}")
    public ResponseEntity salvar(@PathVariable UUID id, @RequestBody DenunciaDTO request) {
        Denuncia denuncia = Denuncia.builder()
                .usuario(usuarioService.buscarPorId(id).get())
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .anonimo(request.isAnonimo())
                .status(Status.ENVIADO)
                .data(LocalDate.now())
                .build();
        try {
            Denuncia salvo = denunciaService.salvar(denuncia);
            return new ResponseEntity<>(salvo, HttpStatus.CREATED);
        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("{id}")
    public ResponseEntity atualizar(@PathVariable UUID id, @RequestBody DenunciaDTO request) {
        try {
            // Recupera o denuncia existente do banco de dados
            Denuncia denunciaExistente = denunciaService.buscarPorId(id).get();

            if (denunciaExistente == null) {
                return ResponseEntity.notFound().build(); // Retorna 404 se a denúncia não for encontrado
            }

            // Atualiza os campos passados no DTO
            if (request.getTitulo() != null && !request.getTitulo().trim().isEmpty()) {
                denunciaExistente.setTitulo(request.getTitulo());
            }
            if (request.getDescricao() != null && !request.getDescricao().trim().isEmpty()) {
                denunciaExistente.setDescricao(request.getDescricao());
            }
            if (request.getLatitude() != null) {
                denunciaExistente.setLatitude(request.getLatitude());
            }
            if (request.getLongitude() != null) {
                denunciaExistente.setLongitude(request.getLongitude());
            }
            if (request.isAnonimo() != denunciaExistente.isAnonimo()) {
                denunciaExistente.setAnonimo(request.isAnonimo());
            }
            if (request.getStatus() != null) {
                denunciaExistente.setStatus(request.getStatus());
            }
            if (request.getData() != null) {
                denunciaExistente.setData(request.getData());
            }

            // Atualiza a denúncia no banco de dados
            Denuncia atualizado = denunciaService.atualizar(denunciaExistente);

            return ResponseEntity.ok(atualizado);
        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/buscarPorId/{id}")
    public ResponseEntity buscarPorId(@PathVariable UUID id) {
        try {
            Denuncia denuncia = denunciaService.buscarPorId(id).get();
            return ResponseEntity.ok(denuncia);

        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/buscarPorUsuario/{id}")
    public ResponseEntity buscarPorUsuario(@PathVariable UUID id) {
        try {
            List<Denuncia> lista = denunciaService.buscarPorUsuario(id);
            return ResponseEntity.ok(lista);

        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/listarTodos")
    public ResponseEntity listarTodos() {
        try {
            List<Denuncia> lista = denunciaService.listarTodos();
            return ResponseEntity.ok(lista);

        } catch (RegraNegocioRunTime | BuscaVaziaRunTime e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity deletar(@PathVariable UUID id){
        try {
            denunciaService.deletar(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
