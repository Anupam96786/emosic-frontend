import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FeatureStorageService} from "../../services/feature-storage.service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit{
  emotion!: string;
  constructor(private route: ActivatedRoute, private router: Router, private featureStorage: FeatureStorageService) {
  }

  ngOnInit(): void {
    if (this.featureStorage.isEmpty()) {
      this.router.navigate(['/']).then(r => {});
    }
    this.emotion = <string>this.route.snapshot.paramMap.get('emotion');
  }
}
