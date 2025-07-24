import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent {
  factoryProfile = {
    location: 'Kumbaduwaa Estate, Kumbaduwaa,Meegahathanna',
    totalArea: '70,000 sq ft',
    yearStarted: '2004',
    capacity: '60,000 green leaf per day',
    boughtLeaf: '12,555,000 kg',
    production: '225,000 MT per month',
    mainGrades: 'OPA,PEKOE,BOP,FBOPF,OP,SP,OPA,BOPF, BOP, FBOPF, EXSP',
    employment: '510',
    suppliers: '12,800'
  };
}