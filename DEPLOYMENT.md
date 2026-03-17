# Deployment and Installation Guide

## Prerequisites

### Backend Requirements
- Java Development Kit (JDK) 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12+ (for production)
- Minimum 2GB RAM, 10GB storage

### Frontend Requirements
- Node.js 16+ and npm 8+
- Xcode 13+ (for iOS development)
- Android Studio (for Android development)
- Minimum 4GB RAM, 15GB storage

## Backend Deployment

### Development Environment

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd flood-damage-assessment/backend
   ```

2. **Build the project**
   ```bash
   mvn clean install
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

4. **Verify**
   - API: `http://localhost:8080/api/assessments`
   - H2 Console: `http://localhost:8080/h2-console`

### Production Environment

#### AWS EC2 Deployment

1. **Launch EC2 Instance**
   ```bash
   AMI: Ubuntu 20.04 LTS
   Instance Type: t3.medium or larger
   Storage: 30GB EBS
   Security Group: Allow 80, 443, 8080
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y openjdk-17-jdk maven postgresql postgresql-contrib

   ```

3. **Configure PostgreSQL**
   ```bash
   sudo -i -u postgres
   createdb flood_assessment
   psql -c "CREATE USER flood_user WITH PASSWORD 'secure_password';"
   psql -c "ALTER ROLE flood_user SET client_encoding TO 'utf8';"
   psql -c "GRANT ALL PRIVILEGES ON DATABASE flood_assessment TO flood_user;"
   exit
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone <repo-url>
   cd flood-damage-assessment/backend

   # Create production properties
   cat > src/main/resources/application-prod.properties << EOF
   spring.datasource.url=jdbc:postgresql://localhost:5432/flood_assessment
   spring.datasource.driverClassName=org.postgresql.Driver
   spring.datasource.username=flood_user
   spring.datasource.password=secure_password
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect
   spring.jpa.hibernate.ddl-auto=validate
   server.port=8080
   upload.dir=/var/flood-assessment/uploads
   EOF

   # Build and run
   mvn clean package -Pprod
   java -jar target/flood-damage-assessment-1.0.0.jar --spring.profiles.active=prod &
   ```

#### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM openjdk:17-slim

   WORKDIR /app

   COPY target/flood-damage-assessment-1.0.0.jar app.jar

   EXPOSE 8080

   CMD ["java", "-jar", "app.jar"]
   ```

2. **Build Docker Image**
   ```bash
   mvn clean package -Pprod -DskipTests
   docker build -t ceres/flood-assessment:latest .
   ```

3. **Run Docker Container**
   ```bash
   docker run -d \
     --name flood-assessment \
     -p 8080:8080 \
     -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/flood_assessment \
     -e SPRING_DATASOURCE_USERNAME=flood_user \
     -e SPRING_DATASOURCE_PASSWORD=secure_password \
     ceres/flood-assessment:latest
   ```

#### Kubernetes Deployment

1. **Create Deployment**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: flood-assessment
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: flood-assessment
     template:
       metadata:
         labels:
           app: flood-assessment
       spec:
         containers:
         - name: flood-assessment
           image: ceres/flood-assessment:latest
           ports:
           - containerPort: 8080
           env:
           - name: SPRING_DATASOURCE_URL
             valueFrom:
               secretKeyRef:
                 name: db-secret
                 key: url
           - name: SPRING_DATASOURCE_USERNAME
             valueFrom:
               secretKeyRef:
                 name: db-secret
                 key: username
           - name: SPRING_DATASOURCE_PASSWORD
             valueFrom:
               secretKeyRef:
                 name: db-secret
                 key: password
   ```

2. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f deployment.yaml
   kubectl expose deployment flood-assessment --type=LoadBalancer --port=80 --target-port=8080
   ```

## Frontend Deployment

### Ionic Web Deployment

1. **Build for production**
   ```bash
   npm run build --prod
   ```

2. **Deploy to Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy
   ```

3. **Deploy to AWS S3 + CloudFront**
   ```bash
   aws s3 sync dist/flood-damage-assessment s3://my-bucket --delete
   aws cloudfront create-invalidation --distribution-id E1234567 --paths "/*"
   ```

### Android App Deployment

1. **Build APK**
   ```bash
   npm run build
   npx cap sync android
   cd android
   ./gradlew assembleRelease
   ```

2. **Sign APK**
   ```bash
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
     -keystore my-release-key.jks \
     app-release-unsigned.apk alias_name

   jarsigner -verify -verbose -certs app-release-unsigned.apk
   ```

3. **Upload to Google Play**
   - Create Google Play account
   - Upload signed APK
   - Configure store listing
   - Submit for review

### iOS App Deployment

1. **Build iOS Project**
   ```bash
   npm run build
   npx cap sync ios
   open ios/App/App.xcworkspace
   ```

2. **Code Sign in Xcode**
   - Select team
   - Configure provisioning profile
   - Update bundle identifier

3. **Archive and Upload**
   - Product → Archive
   - Use Transporter to upload to App Store

## SSL/TLS Configuration

### Self-Signed Certificate (Development)
```bash
keytool -genkey -alias tomcat -storetype PKCS12 \
  -keyalg RSA -keysize 2048 \
  -keystore keystore.p12 -validity 3650
```

### Let's Encrypt (Production)
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com

# Configure in application.properties
server.ssl.key-store=/etc/letsencrypt/live/yourdomain.com/keystore.p12
server.ssl.key-store-password=yourpassword
server.ssl.key-store-type=PKCS12
```

## Environment Variables

### Backend
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/flood_assessment
SPRING_DATASOURCE_USERNAME=flood_user
SPRING_DATASOURCE_PASSWORD=secure_password
SPRING_PROFILES_ACTIVE=prod
UPLOAD_DIR=/var/flood-assessment/uploads
```

### Frontend
```bash
API_URL=https://api.yourdomain.com
APP_ENV=production
DEBUG=false
```

## Monitoring and Maintenance

### Application Monitoring
```bash
# Using Prometheus
docker run -d -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus
```

### Log Management
```bash
# Centralized logging with ELK Stack
docker-compose -f docker-compose.yml up -d
```

### Database Backup
```bash
# Automated daily backup
0 2 * * * pg_dump -U flood_user flood_assessment > /backups/flood_assessment_$(date +\%Y\%m\%d).sql
```

## Health Checks

### Backend Health
```bash
curl http://localhost:8080/actuator/health
```

### Frontend Availability
```bash
curl -I https://yourdomain.com
```

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
tail -f logs/spring.log

# Verify database connection
psql -h localhost -U flood_user -d flood_assessment

# Check port availability
lsof -i :8080
```

### High Memory Usage
```bash
# Increase heap size
java -Xmx2G -Xms1G -jar flood-damage-assessment-1.0.0.jar

# Monitor
jps -l
jstat -gc <pid>
```

### Photo Upload Issues
```bash
# Check permissions
ls -la /var/flood-assessment/uploads

# Fix if needed
sudo chown -R application:application /var/flood-assessment/uploads
sudo chmod 755 /var/flood-assessment/uploads
```

## Performance Tuning

### Database Connection Pool
```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.maximum-lifetime=1200000
```

### JVM Tuning
```bash
java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 \
  -XX:+ParallelRefProcEnabled \
  -Xmx2G -Xms1G \
  -jar flood-damage-assessment-1.0.0.jar
```

## Version Management

### Semantic Versioning
- Major.Minor.Patch (e.g., 1.0.0)
- Update version in `pom.xml` and `package.json`
- Tag releases in Git

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Rollback Procedure

```bash
# Keep previous version deployed
docker pull ceres/flood-assessment:0.9.0
docker stop flood-assessment
docker run -d --name flood-assessment ... ceres/flood-assessment:0.9.0
```
