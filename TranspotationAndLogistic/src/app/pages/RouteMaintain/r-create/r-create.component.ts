import { Component, signal, WritableSignal, OnInit } from '@angular/core';
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
export class RtCreateComponent implements OnInit {
  formData = signal<Rview>({
    rId: 0,
    rName: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
    collectorId: 0,
    vehicleId: 0,
    growerLocations: []
  });


  successMessage = signal<string | null>(null);

  waypoints: { location: string }[] = [];

  constructor(
    private router: Router,
    private rService: RService
  ) { }

  ngOnInit() { }

  handleInput(field: keyof Rview, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    this.formData.update(data => ({
      ...data,
      [field]: (field === 'collectorId' || field === 'vehicleId') ? Number(value) : value
    }));
  }

  addWaypoint(location: string) {
    if (!location) return;

    this.waypoints.push({ location });

    this.formData.update(data => ({
      ...data,
      growerLocations: [
        ...data.growerLocations,
        {
          description: location,
          latitude: 0,       // Optional: replace with actual lat
          longitude: 0,      // Optional: replace with actual lng
          RtListId: data.rId
        }
      ]
    }));
  }

  removeWaypoint(index: number) {
    this.waypoints.splice(index, 1);
    this.formData.update(data => {
      const newLocations = [...data.growerLocations];
      newLocations.splice(index, 1);
      return { ...data, growerLocations: newLocations };
    });
  }


  showSuccessMessage(message: string) {
    this.successMessage.set(message);

    // Hide the message after 3 seconds
    setTimeout(() => {
      this.successMessage.set(null);
    }, 3000);
  }


  onSubmit(event: Event) {
    event.preventDefault();
    const formValue = this.formData();

    // Ensure numeric IDs are numbers
    formValue.collectorId = Number(formValue.collectorId);
    formValue.vehicleId = Number(formValue.vehicleId);

    this.rService.create(formValue).subscribe({
      next: (res) => {
        console.log('Route created successfully:', res);
        this.showSuccessMessage('Form submitted successfully!');
        this.router.navigate(['/r-review']);
      },
      error: (err) => {
        console.error('Error creating route:', err);
        alert('Error creating route: ' + err.message);
      }
    });
    
  }

  onCancel() {
    this.router.navigate(['/r-review']);
  }
}