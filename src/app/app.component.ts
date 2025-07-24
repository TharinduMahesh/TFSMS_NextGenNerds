import { ToastComponent } from './components/toast/toast.component'; // <-- IMPORT
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component'; // <-- IMPORT

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,ToastComponent, ConfirmationDialogComponent],
  templateUrl:"./app.component.html",
  
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  name = 'Arunatea';
}
