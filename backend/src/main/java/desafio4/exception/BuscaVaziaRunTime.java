package desafio4.exception;

public class BuscaVaziaRunTime extends RuntimeException{
    public BuscaVaziaRunTime() {
        super("Nenhum resultado para a busca");
    }
}
