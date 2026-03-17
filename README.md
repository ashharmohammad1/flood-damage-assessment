# Flood Damage Assessment Application

A complete mobile-first application for capturing and managing flood damage assessments to chicken farms in Madison County, NC. Built with **Java (Spring Boot)** backend and **Angular/Ionic** frontend with full offline-first capabilities.

## 📋 Overview

This application digitizes the flood damage assessment process, allowing field teams to:
- Capture farm location data (latitude/longitude)
- Document farm address and condition status
- Record number of affected chickens
- Capture photographic evidence
- Work completely offline with automatic sync when internet is available

## 🎯 Key Features

### Core Functionality
- ✅ **Offline-First Architecture** - Complete offline capability with local storage
- ✅ **Real-time Geolocation** - Automatic GPS coordinate capture
- ✅ **Photo Documentation** - Take and attach photos to assessments
- ✅ **Data Synchronization** - Automatic sync when internet connectivity returns
- ✅ **Assessment Management** - Create, view, edit, and delete assessments
- ✅ **Condition Tracking** - Three-tier condition status (Good/Moderate/Bad)
- ✅ **Assessor Attribution** - Track who conducted each assessment

### Technical Features
- Cross-platform mobile compatibility (iOS/Android)
- Responsive design for field use
- Efficient data storage and retrieval
- Network connectivity detection
- Progress tracking for sync operations

## 🏗️ Architecture

### Backend (Java Spring Boot)
```
backend/
├── src/main/java/com/ceres/flood/
│   ├── FloodDamageAssessmentApplication.java
│   ├── controller/          # REST API endpoints
│   │   ├── FarmAssessmentController
│   │   └── PhotoController
│   ├── service/            # Business logic
│   │   ├── FarmAssessmentService
│   │   └── PhotoService
│   ├── model/              # JPA entities
│   │   ├── FarmAssessment
│   │   └── Photo
│   ├── repository/         # Data access layer
│   │   ├── FarmAssessmentRepository
│   │   └── PhotoRepository
│   └── dto/               # Data transfer objects
│       ├── FarmAssessmentDTO
│       └── PhotoDTO
└── resources/
    └── application.properties
```

### Frontend (Angular/Ionic)
```
frontend/
├── src/app/
│   ├── services/
│   │   ├── offline-storage.service.ts    # Local data management
│   │   ├── api.service.ts               # HTTP API calls
│   │   ├── geolocation.service.ts       # GPS integration
│   │   ├── photo.service.ts             # Camera integration
│   │   └── sync.service.ts              # Data synchronization
│   ├── pages/
│   │   ├── home/                        # Dashboard
│   │   ├── assessment/                  # New assessment form
│   │   ├── assessment-detail/           # View/edit assessment
│   │   ├── assessments-list/            # All assessments list
│   │   └── sync/                        # Data sync page
│   └── app.module.ts
├── package.json
└── capacitor.config.json
```

## 🚀 Getting Started

### Prerequisites
- **Backend**: Java 17+, Maven 3.6+
- **Frontend**: Node.js 16+, npm 8+
- **Mobile**: iOS 14+ or Android 8+

### Backend Setup

1. **Navigate to backend directory**
   ```bash
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

4. **Access the API**
   - The API will be available at `http://localhost:8080`
   - H2 Database Console: `http://localhost:8080/h2-console`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd flood-damage-assessment/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Build mobile app (Android)**
   ```bash
   npx cap add android
   npx cap sync android
   npx cap open android
   ```

6. **Build mobile app (iOS)**
   ```bash
   npx cap add ios
   npx cap sync ios
   npx cap open ios
   ```

## 📡 API Documentation

### FarmAssessment Endpoints

#### Create Assessment
```
POST /api/assessments
Content-Type: application/json

{
  "address": "123 Farm Road",
  "latitude": 35.7923,
  "longitude": -85.1234,
  "conditionStatus": "BAD",
  "totalChickens": 5000,
  "notes": "Significant damage to coop",
  "assessor": "John Smith"
}
```

#### Get All Assessments
```
GET /api/assessments
```

#### Get Unsynced Assessments
```
GET /api/assessments/unsynced
```

#### Update Assessment
```
PUT /api/assessments/{id}
Content-Type: application/json

{
  "address": "123 Farm Road",
  "latitude": 35.7923,
  "longitude": -85.1234,
  "conditionStatus": "MODERATE",
  "totalChickens": 5000,
  "notes": "Updated condition",
  "assessor": "John Smith"
}
```

#### Mark as Synced
```
PUT /api/assessments/{id}/sync
```

#### Delete Assessment
```
DELETE /api/assessments/{id}
```

### Photo Endpoints

#### Upload Photo
```
POST /api/photos
Content-Type: multipart/form-data

- assessmentId: <number>
- file: <image file>
- description: "Damage overview"
- capturedAt: "2026-03-17T10:30:00Z"
```

#### Get Photos by Assessment
```
GET /api/photos/assessment/{assessmentId}
```

#### Delete Photo
```
DELETE /api/photos/{id}
```

## 💾 Data Synchronization Strategy

### Offline-First Approach
1. **All data is stored locally** using Ionic Storage
2. **Unsynced flag** tracks which records need server synchronization
3. **Background sync** occurs when internet is detected
4. **Collision handling** - Last write wins strategy
5. **Photo storage** - Base64 encoded for offline storage

### Sync Flow
```
Field Team (Offline)
  ↓
Creates Assessment (Local Storage)
  ↓
Takes Photos (Local Storage)
  ↓
Returns to Hotel (Internet Available)
  ↓
Initiates Sync
  ↓
API Service Uploads All Data
  ↓
Server Marks as Synced
  ↓
Local Storage Updated
```

## 🔧 Configuration

### Backend Configuration (`application.properties`)
```properties
# Database
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update

# File Upload
upload.dir=uploads
spring.servlet.multipart.max-file-size=50MB

# Logging
logging.level.com.ceres.flood=DEBUG
```

### Frontend Configuration (`capacitor.config.json`)
```json
{
  "appId": "com.ceres.flood",
  "plugins": {
    "Camera": {
      "permissions": ["camera", "photos"]
    },
    "Geolocation": {
      "permissions": ["geolocation"]
    }
  }
}
```

## 📱 Mobile App Features

### Home Page
- Quick overview of total assessments
- Count of pending syncs
- Quick sync button
- Navigation to key features

### New Assessment Page
- Automatic GPS location capture with manual override
- Three-tier condition selector
- Chicken count entry
- Farm address input
- Assessor identification
- Multi-photo management
- Local save with offline support

### Assessments List
- Filter by condition status
- View all saved assessments
- Sync status indicators
- Quick access to details

### Assessment Detail
- View full assessment information
- Edit capabilities
- Delete option
- Sync status display

### Sync Page
- Connection status indicator
- Last sync timestamp
- Sync progress visualization
- Instructions and error reporting
- Manual sync trigger

## 🔐 Security Considerations

- **Local Storage** - Data encrypted at rest (device-dependent)
- **HTTPS** - Recommended for production deployments
- **CORS** - Configured for mobile app communication
- **Input Validation** - Server-side validation on all endpoints
- **File Upload** - Restricted to image types, size limited

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📦 Production Deployment

### Backend
1. **Database Setup** - Replace H2 with PostgreSQL
2. **Environment Configuration** - Use environment variables
3. **SSL/TLS** - Configure HTTPS
4. **Docker** - Containerize the application
5. **CI/CD** - Set up automated testing and deployment

### Frontend
1. **Production Build** - `npm run build --prod`
2. **Mobile App Publishing** - Submit to App Store/Google Play
3. **Performance Optimization** - Code splitting and lazy loading
4. **Analytics** - Add crash reporting and analytics

## 🐛 Troubleshooting

### Backend Issues
- **Port Already in Use** - Change `server.port` in `application.properties`
- **Database Connection** - Check H2 console at `/h2-console`
- **CORS Errors** - Verify `CorsFilter` configuration

### Frontend Issues
- **Offline Storage Not Working** - Check browser storage permissions
- **Geolocation Not Working** - Verify device permissions and HTTPS (on web)
- **Photos Not Capturing** - Check camera permissions on device
- **API Not Responding** - Verify backend is running and network is connected

## 📊 Database Schema

### FarmAssessment Table
```sql
CREATE TABLE farm_assessments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  address VARCHAR(255) NOT NULL,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  condition_status VARCHAR(20) NOT NULL,
  total_chickens INT NOT NULL,
  notes VARCHAR(1000),
  assessor VARCHAR(255) NOT NULL,
  synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);
```

### Photo Table
```sql
CREATE TABLE photos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  assessment_id BIGINT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  captured_at VARCHAR(100),
  description VARCHAR(500),
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (assessment_id) REFERENCES farm_assessments(id)
);
```

## 📝 Additional Features to Consider

1. **Map Integration** - Display assessments on map
2. **Reporting** - Generate damage assessment reports
3. **Search Functionality** - Full-text search across assessments
4. **Data Export** - Export assessments to CSV/PDF
5. **Photo Gallery** - Swipeable photo viewer
6. **Offline Maps** - Cached map data for offline viewing
7. **Push Notifications** - Sync alerts and status updates
8. **User Authentication** - Login/password management
9. **Role-Based Access** - Assessor vs Admin roles
10. **Audit Trail** - Track all changes and edits

## 📄 License

Proprietary - Ceres Technologies

## 👨‍💼 Support

For questions or issues, contact the development team.

---

**Project Created**: March 17, 2026
**Version**: 1.0.0
