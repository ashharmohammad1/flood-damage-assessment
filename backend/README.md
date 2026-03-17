# Flood Damage Assessment - Backend API

Java Spring Boot REST API for managing farm flood damage assessments.

## Quick Start

### Build
```bash
mvn clean install
```

### Run
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

## Project Structure

- **controllers/** - REST API endpoints
- **services/** - Business logic layer
- **models/** - JPA entity classes
- **repositories/** - Data access layer
- **dto/** - Data transfer objects

## API Endpoints

### Assessments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessments` | Create new assessment |
| GET | `/api/assessments` | Get all assessments |
| GET | `/api/assessments/{id}` | Get assessment by ID |
| PUT | `/api/assessments/{id}` | Update assessment |
| DELETE | `/api/assessments/{id}` | Delete assessment |
| GET | `/api/assessments/unsynced` | Get unsynced assessments |
| PUT | `/api/assessments/{id}/sync` | Mark as synced |
| GET | `/api/assessments/assessor/{name}` | Get by assessor |

### Photos

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/photos` | Upload photo |
| GET | `/api/photos/assessment/{id}` | Get photos for assessment |
| DELETE | `/api/photos/{id}` | Delete photo |

## Database

The application uses H2 database for development.

- Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave blank)

For production, update `application.properties` to use PostgreSQL:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/flood_assessment
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect
```

## Configuration

Edit `src/main/resources/application.properties` to customize:

- Server port (default: 8080)
- Database settings
- File upload directory
- Logging levels

## Dependencies

- Spring Boot 3.1.5
- Spring Data JPA
- H2 Database
- PostgreSQL Driver
- Lombok
- Jackson
- Apache Commons IO

## Testing

```bash
mvn test
```

## Building Docker Image

```bash
mvn spring-boot:build-image
```

## Notes

- All timestamps are stored in UTC
- Photos are stored in the `uploads` directory
- Synced flag tracks which assessments have been uploaded
- CORS is enabled for mobile app access
