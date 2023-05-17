import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {createFFmpeg} from '@ffmpeg/ffmpeg';

@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss']
})
export class RecordAudioComponent {
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];

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
    this.mediaRecorder.start(50)
  }

  stop() {
    this.mediaRecorder.stop();
    let blobWebm = new Blob(this.audioChunks);
    this.convertWebmToWav(blobWebm).then(blobWav => {
      let formData = new FormData();
      formData.append('audio', blobWav);
      this.httpClient.post('http://127.0.0.1:8000/', formData).subscribe((response) => {
        console.log(response);
      });
    });
  }

  async convertWebmToWav(webmBlob: Blob): Promise<Blob> {
    const ffmpeg = createFFmpeg({
      mainName: 'main',
      corePath: 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js',
    });
    await ffmpeg.load();

    const inputName = 'input.webm';
    const outputName = 'output.wav';

    ffmpeg.FS('writeFile', inputName, new Uint8Array(await webmBlob.arrayBuffer()));

    await ffmpeg.run('-i', inputName, outputName);

    const outputData = ffmpeg.FS('readFile', outputName);
    return new Blob([outputData.buffer], {type: 'audio/wav'});
  }
}
