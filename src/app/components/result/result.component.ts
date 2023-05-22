import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FeatureStorageService} from "../../services/feature-storage.service";
import {MessageService} from "primeng/api";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

interface Emotion {
  name: string;
  emoji: string;
  code: string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  providers: [MessageService]
})
export class ResultComponent implements OnInit, AfterViewInit {
  emotion: Emotion = {
    name: '',
    emoji: '',
    code: ''
  };
  correctedEmotion: Emotion | undefined;
  emotions: Emotion[] = [
    {
      name: 'Angry',
      emoji: '😡',
      code: 'angry'
    },
    {
      name: 'Disgust',
      emoji: '😣',
      code: 'disgust'
    },
    {
      name: 'Fear',
      emoji: '😱',
      code: 'fear'
    },
    {
      name: 'Happy',
      emoji: '😄',
      code: 'happy'
    },
    {
      name: 'Neutral',
      emoji: '😐',
      code: 'neutral'
    },
    {
      name: 'Pleasant Surprise',
      emoji: '🤯',
      code: 'ps'
    },
    {
      name: 'Sad',
      emoji: '😞',
      code: 'sad'
    }
  ];
  showEmotionPopup: boolean = false;
  musicUrl: SafeUrl | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private featureStorage: FeatureStorageService, private messageService: MessageService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    // if (this.featureStorage.isEmpty()) {
    //   this.router.navigate(['/']).then(r => {});
    // }
    this.updateEmotion();
  }

  ngAfterViewInit() {
  }

  positiveFeedback() {
    this.featureStorage.postFeatureList(this.emotion.code).then(musicUrl => {
      this.musicUrl = this.sanitizer.bypassSecurityTrustResourceUrl(musicUrl);
    });
  }

  negativeFeedback() {
    this.showEmotionPopup = true;
  }

  submitFeedback() {
    if (!this.correctedEmotion) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select one emotion first'});
    } else {
      this.router.navigate(['result', this.correctedEmotion.code]).then(r => {
        this.showEmotionPopup = false;
        this.updateEmotion();
      });
    }
  }

  updateEmotion() {
    for (let i = 0; i < this.emotions.length; i++) {
      if (this.emotions[i].code === <string>this.route.snapshot.paramMap.get('emotion')) {
        this.emotion = this.emotions[i];
      }
    }
  }
}
