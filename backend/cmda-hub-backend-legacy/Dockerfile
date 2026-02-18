# --- Build stage ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Use official Eclipse Temurin (Adoptium) JDK image
# FROM eclipse-temurin:17-jdk-focal
FROM eclipse-temurin:17-jre-focal


# Install ODBC
RUN apt-get update && apt-get install -y curl gnupg apt-transport-https && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 unixodbc-dev


# Install Python
#RUN apt-get update && apt-get install -y python3 python3-pip

RUN apt-get update && apt-get install -y python3 python3-pip unixodbc unixodbc-dev gcc g++ 

# Copy requirements.txt (mounted from host)
COPY requirements.txt requirements.txt

# Create keystore directory and copy .pfx files
RUN mkdir -p /app/keystore
COPY keystore/CMK_portf_map.pfx /app/keystore/CMK_portf_map.pfx
# Only include the next line if CMK_portf_result.pfx exists and is needed
# COPY keystore/CMK_portf_result.pfx /app/keystore/CMK_portf_result.pfx
RUN chmod 644 /app/keystore/*.pfx && \
    chown -R 1000:1000 /app/keystore

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt


WORKDIR /app
COPY --from=build /app/target/*.war app.war

# Optional: Copy your Python files too if needed
# COPY ./python-scripts /app/python-scripts

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.war"]