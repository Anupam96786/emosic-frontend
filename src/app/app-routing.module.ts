import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RecordAudioComponent} from "./components/record-audio/record-audio.component";
import {ResultComponent} from "./components/result/result.component";

const routes: Routes = [
  {
    path: '',
    component: RecordAudioComponent,
  },
  {
    path: 'result/:emotion',
    component: ResultComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
