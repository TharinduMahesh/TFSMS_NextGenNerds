import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Ensure the path is correct
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    // Remove AppComponent from here
  ],
  imports: [
    BrowserModule,
    HttpClientModule
    // other modules
  ],
  providers: [],
  bootstrap: [] // Bootstrap the standalone AppComponent
})
export class AppModule { }
