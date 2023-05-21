import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit{
  emotion!: string;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.emotion = <string>this.route.snapshot.paramMap.get('emotion');
    console.log(this.emotion)
  }
}
