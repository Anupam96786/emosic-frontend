import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RecordAudioComponent} from "./components/record-audio/record-audio.component";

const routes: Routes = [
  {
    path: '',
    component: RecordAudioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
