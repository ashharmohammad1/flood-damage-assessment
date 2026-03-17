# Flood Damage Assessment - Mobile App (Ionic/Angular)

Mobile-first Angular/Ionic application for capturing flood damage assessments with complete offline-first capabilities.

## Quick Start

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser.

### Production Build
```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── pages/              # Page components
│   │   ├── home/
│   │   ├── assessment/
│   │   ├── assessment-detail/
│   │   ├── assessments-list/
│   │   └── sync/
│   ├── services/           # Business logic services
│   │   ├── offline-storage.service.ts
│   │   ├── api.service.ts
│   │   ├── geolocation.service.ts
│   │   ├── photo.service.ts
│   │   └── sync.service.ts
│   └── app.module.ts
├── assets/                 # Static assets
├── styles.scss            # Global styles
└── index.html
```

## Key Services

### Offline Storage Service
Manages local data persistence using Ionic Storage.
- Save/retrieve assessments
- Manage photos
- Track sync status
- Store unsynced records

### API Service
HTTP client for backend communication.
- Create/update/delete assessments
- Upload photos
- Mark assessments as synced
- Monitor network connectivity

### Geolocation Service
Capacitor Geolocation integration.
- Get current position
- Watch position changes
- Handle location permissions

### Photo Service
Capacitor Camera integration.
- Take photos
- Select from gallery
- Convert to Base64 for offline storage

### Sync Service
Manages data synchronization.
- Queue unsynced assessments
- Upload to server
- Track sync progress
- Handle sync errors

## Building for Mobile

### Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Then build and run in Android Studio.

### iOS
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

Then build and run in Xcode.

## Configuration

- **Backend URL**: Update in `api.service.ts` (currently `http://localhost:8080/api`)
- **Upload Directory**: Configure in backend `application.properties`
- **App ID**: Update in `capacitor.config.json` (currently `com.ceres.flood`)

## Features by Page

### Home Page
- Dashboard with overview statistics
- Quick navigation to main features
- Recent sync status

### Assessment Form
- Automatic GPS capture
- Manual location entry
- Three-level condition selector
- Chicken count input
- Multi-photo support
- Local save with offline support

### Assessments List
- View all saved assessments
- Filter by condition
- Quick access to details
- Sync status indicators

### Assessment Detail
- View full assessment
- Edit capability
- Delete option
- Photo gallery

### Sync Page
- Connection status
- Last sync timestamp
- Sync instructions
- Manual sync trigger
- Progress tracking

## Offline-First Strategy

1. **All data stored locally** in Ionic Storage
2. **Users work completely offline** in the field
3. **Automatically detected** when internet becomes available
4. **Manual sync** when user is ready
5. **Base64 encoded photos** for offline storage
6. **Unsynced flag** on each record

## Dependencies

- @angular/core 16+
- @ionic/angular 7+
- rxjs 7+
- @capacitor/camera
- @capacitor/geolocation
- @ionic/storage-angular

## Troubleshooting

### Storage Issues
- Check browser DevTools → Application → Storage
- Clear storage if needed: Open DevTools Console
  ```javascript
  localStorage.clear()
  sessionStorage.clear()
  ```

### Geolocation Not Working
- Check device location permissions
- On browser, HTTPS is required (except localhost)
- Fallback to manual entry

### Photos Not Saving
- Verify camera permissions
- Check device storage space
- Ensure Capacitor is properly initialized

### Build Issues
```bash
npm install --force
npm run build --prod
```

## Performance Optimization

- Lazy-loaded route modules
- OnPush change detection strategy
- Unsubscribe from observables
- Image compression before upload
- Pagination for large lists

## Testing

```bash
npm run test
```

## Deployment

1. Build production bundle: `npm run build`
2. For web: Deploy to hosting service
3. For mobile: Build APK/IPA and submit to app stores

## Notes

- Uses RxJS for reactive programming
- Ionic components for native UI
- Capacitor for native feature access
- Responsive design for all screen sizes
- Dark mode compatible
