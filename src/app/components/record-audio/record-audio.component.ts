import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {createFFmpeg} from '@ffmpeg/ffmpeg';
import SiriWave from "siriwave";
import {Router} from "@angular/router";
import {FeatureStorageService} from "../../services/feature-storage.service";

@Component({
  selector: 'app-record-audio',
  templateUrl: './record-audio.component.html',
  styleUrls: ['./record-audio.component.scss']
})
export class RecordAudioComponent implements OnInit, AfterViewInit {
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  @ViewChild('siriAnimationContainer') siriAnimationContainer!: ElementRef;
  siriWave!: SiriWave;
  audioIsRecording: boolean = false;
  audioUrl: string | undefined;
  blobWav!: Blob;

  constructor(private httpClient: HttpClient, private router: Router, private featureStorage: FeatureStorageService) {
    navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 22050,
      });

      this.mediaRecorder.addEventListener("dataavailable", event => {
        this.audioChunks.push(event.data);
      });
    });
  }

  startRecording() {
    this.clearRecording();
    this.mediaRecorder.start(50);
    this.audioIsRecording = true;
  }

  stopRecording() {
    this.audioIsRecording = false;
    this.mediaRecorder.stop();
    let blobWebm = new Blob(this.audioChunks);
    this.convertWebmToWav(blobWebm).then(blobWav => {
      this.audioUrl = URL.createObjectURL(blobWav);
      this.blobWav = blobWav;
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

  ngOnInit() {

  }

  clearRecording() {
    this.audioChunks = [];
    if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
    this.audioUrl = undefined;
  }

  submitRecording() {
    let formData = new FormData();
    formData.append('audio', this.blobWav);
    this.httpClient.post<{emotion: string, features: number[]}>('http://127.0.0.1:8000/', formData).subscribe((response) => {
      this.router.navigate(['result', response.emotion]).then(r => {
        this.clearRecording();
        this.featureStorage.addFeatureList(response.features);
      });
    });
  }
}
