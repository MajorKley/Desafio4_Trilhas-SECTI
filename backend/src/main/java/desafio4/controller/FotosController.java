package desafio4.controller;

import desafio4.exception.BuscaVaziaRunTime;
import desafio4.exception.RegraNegocioRunTime;
import desafio4.model.entity.Denuncia;
import desafio4.model.entity.Fotos;
import desafio4.service.DenunciaService;
import desafio4.service.FotosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/fotos")
public class FotosController {
    @Autowired
    DenunciaService denunciaService;

    @Autowired
    FotosService fotosService;

    // -------------------- endpoints CRUD ---------------------

    @PostMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity salvarFotos(
            @PathVariable UUID id,
            @RequestParam(value = "fotos", required = false) MultipartFile[] fotos) {

        try {
            Denuncia denuncia = denunciaService.buscarPorId(id)
                    .orElseThrow(() -> new RegraNegocioRunTime("Denúncia não encontrada"));

            Fotos fotosEntity = new Fotos();
            fotosEntity.setDenuncia(denuncia);

            if (fotos != null) {
                for (int i = 0; i < Math.min(fotos.length, 3); i++) {
                    String base64Foto = Base64.getEncoder().encodeToString(fotos[i].getBytes());
                    switch (i) {
                        case 0: fotosEntity.setFoto1(base64Foto); break;
                        case 1: fotosEntity.setFoto2(base64Foto); break;
                        case 2: fotosEntity.setFoto3(base64Foto); break;
                    }
                }
            }

            Fotos salvo = fotosService.salvar(fotosEntity);
            return new ResponseEntity<>(salvo, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao processar fotos: " + e.getMessage());
        }
    }

    @PutMapping(value = "{id}", consumes = {"multipart/form-data"})
    public ResponseEntity atualizar(
            @PathVariable UUID id,
            @RequestPart(value = "foto1", required = false) MultipartFile foto1,
            @RequestPart(value = "foto2", required = false) MultipartFile foto2,
            @RequestPart(value = "foto3", required = false) MultipartFile foto3) {
        try {
            // Recupera as fotos existentes do banco de dados
            Optional<Fotos> fotosExistenteOptional = fotosService.buscarPorId(id);
            Fotos fotosExistente = fotosExistenteOptional.get();

            if (fotosExistente == null) {
                return ResponseEntity.notFound().build(); // Retorna 404 se as fotos não forrem encontradas
            }

            // Se uma nova foto foi enviada, atualiza, senão mantém a existente
            String foto1Base64 = (foto1 != null) ? Base64.getEncoder().encodeToString(foto1.getBytes()) : fotosExistente.getFoto1();
            String foto2Base64 = (foto2 != null) ? Base64.getEncoder().encodeToString(foto2.getBytes()) : fotosExistente.getFoto2();
            String foto3Base64 = (foto3 != null) ? Base64.getEncoder().encodeToString(foto3.getBytes()) : fotosExistente.getFoto3();

            if (foto1 != null) {
                fotosExistente.setFoto1(foto1Base64);
            }
            if (foto2 != null) {
                fotosExistente.setFoto2(foto2Base64);
            }
            if (foto3 != null) {
                fotosExistente.setFoto3(foto3Base64);
            }

            // Atualiza as fotos no banco de dados
            Fotos atualizado = fotosService.atualizar(fotosExistente);

            return ResponseEntity.ok(atualizado);
        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/buscarPorId/{id}")
    public ResponseEntity buscarPorId(@PathVariable UUID id) {
        try {
            Fotos fotos = fotosService.buscarPorId(id).get();
            return ResponseEntity.ok(fotos);

        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/buscarPorDenuncia/{id}")
    public ResponseEntity buscarPorDenuncia(@PathVariable UUID id) {
        try {
            Fotos fotos = fotosService.buscarPorDenuncia(id).get();
            return ResponseEntity.ok(fotos);

        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/listarTodos")
    public ResponseEntity listarTodos() {
        try {
            List<Fotos> lista = fotosService.listarTodos();
            return ResponseEntity.ok(lista);

        } catch (RegraNegocioRunTime | BuscaVaziaRunTime e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("{id}")
    public ResponseEntity deletar(@PathVariable UUID id){
        try {
            fotosService.deletar(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RegraNegocioRunTime e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
