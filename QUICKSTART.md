# Flood Damage Assessment - Quick Start Guide

## 5-Minute Setup

### Backend Quick Start

```bash
# Terminal 1: Backend
cd flood-damage-assessment/backend
mvn spring-boot:run
# Wait for: "Started FloodDamageAssessmentApplication" message
# Access H2 Console at: http://localhost:8080/h2-console
```

### Frontend Quick Start

```bash
# Terminal 2: Frontend
cd flood-damage-assessment/frontend
npm install
npm start
# Opens browser at: http://localhost:4200
```

**You're ready to start!** 🎉

## First Test Assessment

### Via Frontend
1. Click "New Assessment" on home page
2. Click "Get Current Location" (or enter manually: 35.7923, -85.1234)
3. Fill in details:
   - Address: "123 Test Farm Road"
   - Condition: Select any option
   - Chickens: Enter a number
   - Assessor: "Test User"
4. Click "Save Assessment"
5. View all assessments on "View All Assessments" page

### Via API (cURL)

```bash
curl -X POST http://localhost:8080/api/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "address": "456 Farm Drive",
    "latitude": 35.7924,
    "longitude": -85.1235,
    "conditionStatus": "GOOD",
    "totalChickens": 3000,
    "notes": "Test assessment",
    "assessor": "API User"
  }'
```

## Key Features Demo

### 1. Offline Storage
1. Create an assessment
2. Open DevTools → Network → Offline
3. Create another assessment
4. Go back online
5. See all assessments synced

### 2. Location Services
1. Allow location permission when prompted
2. Current position auto-fills in form
3. Manual entry available as fallback

### 3. Photo Management
1. Click "Take Photo" or "Select from Gallery"
2. Multiple photos can be attached
3. Photos stored locally in offline mode

### 4. Data Sync
1. Go to "Sync" page
2. Review pending items
3. Click "Start Sync" when online
4. Watch progress bar complete
5. See success message

## Understanding the Architecture

### Frontend Flow
```
User Input → Angular Component → Service → Local Storage
                                        ↓
                                  Display Updated UI
```

### Backend Flow
```
REST Request → Controller → Service → Repository → Database
                                           ↓
                                      Response JSON
```

### Sync Flow
```
Offline (Mobile)      →    Online (Hotel)       →    Server
Local Storage        Mobile App Detects         API Validates
(Work Offline)         Internet                 Data Uploaded
                    Initiates Sync             Records Synced
```

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| Backend won't start | Check if port 8080 is available: `lsof -i :8080` |
| Frontend build error | Run `npm install --force` |
| No location data | Enable location permissions in browser/device |
| Photos not saving | Check device storage permissions |
| Can't sync data | Verify backend is running on port 8080 |
| Database error | Clear H2 database and restart |

## Development Tips

### Enable Debug Logging
```properties
# In backend/src/main/resources/application.properties
logging.level.com.ceres.flood=DEBUG
logging.level.org.springframework.web=DEBUG
```

### View Local Storage
```javascript
// In browser console
localStorage.getItem('assessments')
// Copy to JSON viewer for better formatting
```

### Simulate Offline Mode
```javascript
// In browser DevTools Console
console.log('Now simulate offline in Network tab')
```

## Next Steps

1. **Customize API URL**: Update in `frontend/src/app/services/api.service.ts`
2. **Add Authentication**: Implement Login page
3. **Enhance UI**: Add images, icons, custom styling
4. **Deploy**: Follow DEPLOYMENT.md guide
5. **Mobile Build**: Build APK/IPA using Capacitor

## File Structure at a Glance

```
flood-damage-assessment/
├── README.md                    # Main documentation
├── ARCHITECTURE.md              # System design
├── DEPLOYMENT.md                # Production guide
│
├── backend/                     # Java Spring Boot
│   ├── pom.xml                 # Dependencies
│   ├── src/main/java/com/ceres/flood/
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic
│   │   ├── model/              # Entities
│   │   └── repository/         # Data access
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                    # Angular/Ionic
    ├── package.json            # Dependencies
    ├── capacitor.config.json   # Mobile config
    ├── angular.json            # Angular config
    └── src/app/
        ├── pages/              # Page components
        ├── services/           # Business logic
        └── app.module.ts       # Main module
```

## Common API Endpoints

### Get All Assessments
```bash
GET /api/assessments
```

### Create Assessment
```bash
POST /api/assessments
Content-Type: application/json
```

### Get Unsynced
```bash
GET /api/assessments/unsynced
```

### Upload Photo
```bash
POST /api/photos
Content-Type: multipart/form-data
- assessmentId
- file
- description
- capturedAt
```

For more details, see README.md and ARCHITECTURE.md

## Support & Resources

- **Documentation**: See README.md in root and each directory
- **Backend Details**: See backend/README.md
- **Frontend Details**: See frontend/README.md
- **Architecture**: See ARCHITECTURE.md
- **Deployment**: See DEPLOYMENT.md

## Quick Reference

### Commands

| Command | Purpose |
|---------|---------|
| `mvn spring-boot:run` | Start backend |
| `npm start` | Start frontend dev server |
| `npm run build` | Build frontend production |
| `npx cap sync android` | Prepare Android build |
| `npx cap sync ios` | Prepare iOS build |

### Default Ports

| Service | Port |
|---------|------|
| Backend API | 8080 |
| Frontend Dev | 4200 |
| H2 Console | 8080/h2-console |

### Default Credentials

| Service | User | Password |
|---------|------|----------|
| H2 Database | sa | (blank) |

---

**Ready to start assessing?** Open the app and create your first assessment! 🚀
