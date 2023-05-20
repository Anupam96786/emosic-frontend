import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {createFFmpeg} from '@ffmpeg/ffmpeg';
import SiriWave from "siriwave";

@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss']
})
export class RecordAudioComponent implements AfterViewInit {
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  @ViewChild('siriAnimationContainer') siriAnimationContainer!: ElementRef;
  siriWave!: SiriWave;
  audioIsRecording: boolean = false;
  audioUrl: string | undefined;

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

  startRecording() {
    this.audioChunks = [];
    this.mediaRecorder.start(50);
    this.audioIsRecording = true;
  }

  stopRecording() {
    this.audioIsRecording = false;
    this.mediaRecorder.stop();
    let blobWebm = new Blob(this.audioChunks);
    this.convertWebmToWav(blobWebm).then(blobWav => {
      this.audioUrl = URL.createObjectURL(blobWav);
      console.log(this.audioUrl);
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

  ngAfterViewInit(): void {
    this.siriWave = new SiriWave({
      container: this.siriAnimationContainer.nativeElement,
      cover: true,
      style: 'ios9',
      amplitude: 2.1,
      speed: 0.15,
    });
  }
}
