import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureStorageService {
  private features: number[] = [];

  addFeatureList(features: number[]) {
    this.features = features;
  }

  removeFeatureList() {
    this.features = [];
  }

  isEmpty(): boolean {
    return this.features.length === 0;
  }
}
