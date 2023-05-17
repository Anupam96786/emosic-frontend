import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss']
})
export class RecordAudioComponent {
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  audioUrl?: string;

  constructor(private httpClient: HttpClient) {
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 22050,
      });

      this.mediaRecorder.addEventListener("dataavailable", event => {
        console.log('yo')
        this.audioChunks.push(event.data);
      });
    });
  }

  record() {
    this.audioChunks = [];
    this.mediaRecorder.start(100)
  }

  stop() {
    this.mediaRecorder.stop();
    let formData = new FormData();
    let blobAudio = new Blob(this.audioChunks);
    formData.append('audio', blobAudio);
    this.httpClient.post('http://127.0.0.1:8000/', formData).subscribe((response) => {
      console.log(response);
    });
  }
}
