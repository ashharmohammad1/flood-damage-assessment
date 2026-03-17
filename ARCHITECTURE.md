# System Design & Architecture

## Overview

The Flood Damage Assessment application is built on a modern, scalable architecture designed specifically for offline-first mobile operation with optional backend synchronization.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APPLICATION                       │
│              (Angular/Ionic with Capacitor)                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              User Interface Layer                     │   │
│  │  (Home, Assessment Form, List, Detail, Sync Pages)  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Services Layer (RxJS Observables)         │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │  • Offline Storage (Ionic Storage)          │     │   │
│  │  │  • API Communication (HTTP Client)          │     │   │
│  │  │  • Geolocation (Capacitor)                  │     │   │
│  │  │  • Photo Capture (Capacitor Camera)         │     │   │
│  │  │  • Data Synchronization                     │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     Local Storage Layer (Device Storage)            │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │  • Assessments (JSON)                       │     │   │
│  │  │  • Photos (Base64 encoded)                  │     │   │
│  │  │  • Sync Status                              │     │   │
│  │  │  • Last Sync Timestamp                      │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
            ↕ (When Connected to Internet)
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                        │
│              (Spring Boot Java Application)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           REST API Controllers Layer                 │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │  • /api/assessments - CRUD operations      │     │   │
│  │  │  • /api/photos - Photo management          │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Business Logic Layer (Services)            │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │  • FarmAssessmentService                    │     │   │
│  │  │  • PhotoService                             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Data Access Layer (JPA Repositories)         │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │  • FarmAssessmentRepository                 │     │   │
│  │  │  • PhotoRepository                          │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Database Layer (PostgreSQL/H2)            │   │
│  │  ┌─────────────────────────────────────────────┐     │   │
│  │  │  • farm_assessments table                   │     │   │
│  │  │  • photos table                             │     │   │
│  │  └─────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating Assessment (Offline)

```
User Input Form
    ↓
Form Validation
    ↓
Create FarmAssessment Object
    ↓
Save to Ionic Storage (with synced=false)
    ↓
Update UI (Observable stream)
    ↓
Display Success Message
```

### Adding Photos (Offline)

```
User Selects/Takes Photo
    ↓
Camera/Gallery Capture (Capacitor)
    ↓
Convert to Base64
    ↓
Create Photo Object
    ↓
Attach to Assessment
    ↓
Save to Local Storage
    ↓
Update Photo Gallery View
```

### Syncing Data (Online)

```
User Initiates Sync
    ↓
Check Internet Connection
    ↓
Retrieve Unsynced Assessments
    ↓
For Each Assessment:
    ├─ Create/Update via API
    ├─ Upload Photos
    └─ Mark as Synced
    ↓
Update Local Storage
    ↓
Display Sync Results
    ↓
Store Last Sync Timestamp
```

## Data Models

### FarmAssessment
```typescript
{
  id: number,                    // Auto-generated
  address: string,               // Farm address
  latitude: number,              // GPS north-south
  longitude: number,             // GPS east-west
  conditionStatus: string,       // 'GOOD' | 'MODERATE' | 'BAD'
  totalChickens: number,         // Count of affected chickens
  notes: string,                 // Optional notes
  assessor: string,              // Name of assessor
  synced: boolean,               // Sync status
  photos: Photo[],               // Associated photos
  createdAt: Date,               // Creation timestamp
  updatedAt: Date                // Last update timestamp
}
```

### Photo
```typescript
{
  id: number,                    // Auto-generated
  assessmentId: number,          // Parent assessment
  fileName: string,              // Original filename
  filePath: string,              // Server storage path
  contentType: string,           // MIME type
  base64Data: string,            // Offline storage (frontend only)
  capturedAt: string,            // ISO timestamp
  description: string,           // Optional caption
  createdAt: Date
}
```

## State Management

### Local Storage Structure

```
Ionic Storage:
├── assessments: [
│   {
│     id: 1645632000000,
│     address: "123 Farm Road",
│     ...
│     synced: false,
│     photos: [
│       {
│         id: 1645632001000,
│         base64Data: "data:image/jpeg;base64,...",
│         ...
│       }
│     ]
│   }
│ ]
└── lastSyncTime: "2026-03-17T14:30:00Z"
```

## Offline-First Pattern

### Key Principles

1. **Work First, Sync Later**
   - All data operations happen locally first
   - Sync is batched when connection is available
   - No data loss due to connectivity

2. **Unsynced Tracking**
   - Each record has a `synced` flag
   - Server confirms sync completion
   - Failed syncs are retried

3. **Conflict Resolution**
   - Last-write-wins strategy
   - Server timestamp authoritative
   - Client timestamps for reference

4. **Network Detection**
   - Monitors online/offline events
   - Automatic sync detection (optional)
   - Manual sync control available

## Performance Considerations

### Frontend Performance
- **Lazy Loading**: Route modules loaded on demand
- **Change Detection**: OnPush strategy for components
- **Memory**: Unsubscribe from observables
- **Storage**: Efficient Base64 compression
- **Images**: Resize before storage

### Backend Performance
- **Indexing**: Latitude/longitude for location queries
- **Pagination**: Large result sets
- **Caching**: Assessment queries
- **Batch Operations**: Multiple photo uploads

## Security Architecture

### Frontend
- Local storage encryption (device-dependent)
- HTTPS for all API calls
- Input validation before submission
- XSS protection via Angular sanitization

### Backend
- CORS configuration for mobile app
- Input validation on all endpoints
- File upload restrictions
- SQL injection prevention via JPA
- Secure photo storage

## Scalability

### Horizontal Scaling
```
Load Balancer
    ↓
Spring Boot Instance 1
Spring Boot Instance 2
Spring Boot Instance 3
    ↓
PostgreSQL Database
(with read replicas)
    ↓
S3/Object Storage
(for photos)
```

### Database Optimization
- Index on assessment date range
- Index on synced status
- Index on assessor name
- Partitioning by date for large datasets

## Disaster Recovery

### Backup Strategy
- Daily database backups
- Photo storage redundancy
- Transaction logging
- Point-in-time recovery

### Failure Recovery
- Sync retry mechanism
- Offline queue persistence
- Error logging and alerts
- Graceful degradation

## Technology Stack

### Frontend
- **Framework**: Angular 16
- **Mobile**: Ionic 7
- **State**: RxJS Observables
- **Storage**: Ionic Storage (IndexedDB/SQLite)
- **Native**: Capacitor
- **Build**: Angular CLI

### Backend
- **Framework**: Spring Boot 3.1
- **ORM**: Spring Data JPA
- **Database**: H2 (dev) / PostgreSQL (prod)
- **Build**: Maven 3.6+
- **Runtime**: Java 17+

## Deployment Architecture

### Development
```
Local Machine
├── Frontend: localhost:4200
└── Backend: localhost:8080
```

### Production
```
AWS/Cloud Provider
├── Frontend
│   ├── CloudFront (CDN)
│   └── S3 (Static Hosting)
├── Backend
│   ├── Load Balancer
│   ├── Auto-scaling EC2/ECS
│   └── RDS PostgreSQL
└── Storage
    └── S3 (Photo Storage)
```

## API Contract Example

### Request
```json
POST /api/assessments
{
  "address": "123 Farm Road",
  "latitude": 35.7923,
  "longitude": -85.1234,
  "conditionStatus": "BAD",
  "totalChickens": 5000,
  "assessor": "John Smith"
}
```

### Response
```json
{
  "id": 1,
  "address": "123 Farm Road",
  "latitude": 35.7923,
  "longitude": -85.1234,
  "conditionStatus": "BAD",
  "totalChickens": 5000,
  "assessor": "John Smith",
  "synced": true,
  "createdAt": "2026-03-17T10:30:00Z",
  "updatedAt": null
}
```

## Future Enhancements

1. **Real-time Sync**: WebSocket for live updates
2. **Offline Maps**: Cached map tiles
3. **Analytics**: Usage tracking and insights
4. **Mobile Optimization**: App size reduction
5. **Push Notifications**: Sync alerts
6. **Multi-user**: Team collaboration features
