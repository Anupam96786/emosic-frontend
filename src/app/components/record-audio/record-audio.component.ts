import {Component} from '@angular/core';

@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss']
})
export class RecordAudioComponent {
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  audioUrl?: string;

  constructor() {
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
    this.audioUrl = URL.createObjectURL(new Blob(this.audioChunks));
  }
}
