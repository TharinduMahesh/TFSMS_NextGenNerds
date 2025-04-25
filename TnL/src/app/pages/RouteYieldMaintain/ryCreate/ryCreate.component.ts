import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ryform',
  standalone : true,
  imports: [ReactiveFormsModule],
  templateUrl: './ryCreate.component.html',
  styleUrls: ['./ryCreate.component.scss']
})
export class RYformComponent {
  routeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.routeForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      routeName: ['', [Validators.required, Validators.minLength(3)]],
      collectorId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      vehicleId: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9-]+$')]],
      collectedyield: ['', [Validators.required, Validators.min(0)]],
      gtpresent: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.routeForm.valid) {
      console.log('Form Data:', this.routeForm.value);
    } else {
      console.log('Invalid Form');
    }
  }
}
