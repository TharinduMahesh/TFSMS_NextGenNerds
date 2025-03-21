// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import {PaymentComponent} from './payment/payment.component';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet,PaymentComponent],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css'
// })
// export class AppComponent {
//   title = 'payments';
// }

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl:"./app.component.html",
  
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  name = 'Arunatea';
}
