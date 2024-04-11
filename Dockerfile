FROM eclipse-temurin:17.0.8_7-jre
COPY target/OnlineChat-0.0.1-SNAPSHOT.jar /app/OnlineChat.jar
EXPOSE 7777
ENTRYPOINT ["java","-jar","/app/OnlineChat.jar"]