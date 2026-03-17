import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  private currentLocation = new BehaviorSubject<Location | null>(null);
  public currentLocation$ = this.currentLocation.asObservable();

  private watchId: string | null = null;

  constructor() {
    this.requestPermissions();
  }

  async requestPermissions() {
    try {
      const permission = await Geolocation.requestPermissions();
      console.log('Geolocation permission:', permission);
    } catch (error) {
      console.error('Error requesting geolocation permission:', error);
    }
  }

  async getCurrentLocation(): Promise<Location> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const location: Location = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy,
        timestamp: coordinates.timestamp
      };
      this.currentLocation.next(location);
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  startWatching(): Observable<Location> {
    return new Observable(observer => {
      Geolocation.watchPosition(
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
        (position) => {
          if (position) {
            const location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            };
            this.currentLocation.next(location);
            observer.next(location);
          }
        }
      ).then(id => {
        this.watchId = id.toString();
      }).catch(error => {
        console.error('Error watching position:', error);
        observer.error(error);
      });
    });
  }

  stopWatching() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  getCurrentLocationValue(): Location | null {
    return this.currentLocation.value;
  }
}
