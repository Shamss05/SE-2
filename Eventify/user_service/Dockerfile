FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml ./pom.xml
COPY eventify-common/pom.xml eventify-common/pom.xml
COPY user_service/pom.xml user_service/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY event-service/pom.xml event-service/pom.xml
COPY booking-service/pom.xml booking-service/pom.xml
COPY notification-service/pom.xml notification-service/pom.xml
COPY eureka-server/pom.xml eureka-server/pom.xml

RUN mvn -q -pl user_service -am dependency:go-offline

COPY eventify-common/src eventify-common/src
COPY user_service/src user_service/src

RUN mvn -q -pl user_service -am clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /build/user_service/target/auth-service-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
