import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/Notification/toast/toast.component'; // <-- IMPORT
import { ConfirmationDialogComponent } from './components/Notification/confirmation-dialog/confirmation-dialog.component';

//import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ConfirmationDialogComponent,ToastComponent ,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tea-packing-ledger';
}
