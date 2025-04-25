// rform.component.ts
import { Component, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rview } from '../../../models/rview.model';
import { RService } from '../../../services/RouteMaintainService/RouteMaintain.service';

@Component({
  selector: 'app-rform',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './r-create.component.html',
  styleUrls: ['./r-create.component.scss']
})
export class RtCreateComponent {
  formData = signal<Rview>({
    id:0,
    rName:'',
    startLocation: '',
    endLocation: '',
    distance: '',
    collectorId:0,
    vehicleId:0
  });

  constructor(private router: Router , private rService: RService) {}

  handleInput(field: keyof Rview, event: Event) {
    const input = event.target as HTMLInputElement;
    let value: string | number | null = input.value;

    this.formData.update(data => ({ ...data, [field]: value }));
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const formValue = this.formData();
  
    this.rService.create(formValue).subscribe({
      next: (res) => {
        console.log('Route created successfully:', res);
        this.router.navigate(['/rview']);
      },
      error: (err) => {
        console.error('Error creating route:', err);
        alert(err.message); // optional: show user-friendly error
      }
    });
  }
  

  onCancel() {
    this.router.navigate(['/rview']);
  }
}