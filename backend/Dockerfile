# Stage 1 - Build com JDK 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app
COPY pom.xml .
# Baixa dependências primeiro (cache eficiente)
RUN mvn dependency:go-offline -B -Dstyle.color=never

COPY src ./src
# Build com log simplificado
RUN mvn clean package -DskipTests -B -Dstyle.color=never -Dorg.slf4j.simpleLogger.log.org.apache.maven.cli.transfer.Slf4jMavenTransferListener=warn

# Stage 2 - Imagem final
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copia usando wildcard para evitar erros de nome
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]