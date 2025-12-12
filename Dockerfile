###################################################
# Stage: base
# 
# This base stage ensures all other stages are using the same base image
# and provides common configuration for all stages, such as the working dir.
###################################################
FROM node:22 AS base
WORKDIR /usr/local/app

################## CLIENT STAGES ##################

###################################################
# Stage: client-base
#
# This stage is used as the base for the client-dev and client-build stages,
# since there are common steps needed for each.
###################################################
FROM base AS client-base
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/.eslintrc.cjs client/index.html client/vite.config.js ./
COPY client/public ./public
COPY client/src ./src

###################################################
# Stage: client-dev
# 
# This stage is used for development of the client application. It sets 
# the default command to start the Vite development server.
###################################################
FROM client-base AS client-dev
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN echo "🔍 Building with dev VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID"
CMD ["npm", "run", "dev"]

###################################################
# Stage: client-build
#
# This stage builds the client application, producing static HTML, CSS, and
# JS files that can be served by the backend.
###################################################
FROM client-base AS client-build
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN echo "🔍 Building with build VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID"
RUN npm run build


###################################################
################  BACKEND STAGES  #################
###################################################

###################################################
# Stage: backend-build
# Build the Java backend using Maven
###################################################
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /usr/src/app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

###################################################
# Stage: final
# Combine backend JAR and frontend build
###################################################
FROM eclipse-temurin:21-jre AS final
WORKDIR /app

# Copy the built JAR from the backend build stage
COPY --from=backend-build /usr/src/app/target/*.jar app.jar

# Optional: Copy frontend build into static resources (if your Spring Boot serves static files)
COPY --from=client-build /usr/local/app/dist ./static

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]