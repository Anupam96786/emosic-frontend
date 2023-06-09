import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FeatureStorageService {
  private features: number[] = [];

  constructor(private http: HttpClient) {
  }

  addFeatureList(features: number[]) {
    this.features = features;
  }

  postFeatureList(emotion: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.post<{music_url: string}>('http://127.0.0.1:8000/feedback/', {emotion: emotion, features: this.features}).subscribe(response => {
        resolve(response.music_url);
        this.removeFeatureList();
      });
    });
  }

  removeFeatureList() {
    this.features = [];
  }

  isEmpty(): boolean {
    return this.features.length === 0;
  }
}
