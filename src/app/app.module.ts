import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RecordAudioComponent } from './components/record-audio/record-audio.component';
import {HttpClientModule} from "@angular/common/http";
import { ResultComponent } from './components/result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    RecordAudioComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
