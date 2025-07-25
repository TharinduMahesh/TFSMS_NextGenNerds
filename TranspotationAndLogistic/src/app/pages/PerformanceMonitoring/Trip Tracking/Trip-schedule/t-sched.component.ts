import { Component, OnInit, signal, inject } from '@angular/core'; // ** Make sure 'signal' is imported **
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Models
import { ScheduleTripPayload } from '../../../../models/Logistic and Transport/TripTracking.model';
import { RtList } from '../../../../models/Logistic and Transport/RouteMaintain.model';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';

// Services
import { TransportReportService } from '../../../../services/LogisticAndTransport/TransportReport.service';
import { RouteService } from '../../../../services/LogisticAndTransport/RouteMaintain.service';
import { CollectorService } from '../../../../services/LogisticAndTransport/Collector.service';

@Component({
  selector: 'app-trip-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './t-sched.component.html', // Or your actual file name
  styleUrls: ['./t-sched.component.scss']
})
export class TripScheduleComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private transportReportService = inject(TransportReportService);
  private routeService = inject(RouteService);
  private collectorService = inject(CollectorService);

  tripForm: FormGroup;
  routes = signal<RtList[]>([]);
  collectors = signal<CollectorResponse[]>([]);
  
  isLoading = signal(true); 
  // --- ADD THIS MISSING PROPERTY ---
  error = signal<string | null>(null);

  constructor() {
    this.tripForm = this.fb.group({
      routeId: [null, Validators.required],
      collectorId: [null, Validators.required],
      scheduledDeparture: ['', Validators.required],
      scheduledArrival: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.isLoading.set(true); 
    this.error.set(null); // Reset error state on init

    forkJoin({
      routes: this.routeService.getAllRoutes(),
      collectors: this.collectorService.getAllCollectors()
    }).subscribe({
      next: ({ routes, collectors }) => {
        this.routes.set(routes);
        this.collectors.set(collectors);
        this.isLoading.set(false);
      },
      error: (err) => {
        // Now you can set the error signal, which the template can display
        this.error.set('Failed to load required data for scheduling: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.tripForm.invalid) {
      alert('Please fill out all fields.');
      return;
    }

    const payload: ScheduleTripPayload = this.tripForm.value;

    // Optional: Indicate loading state during form submission
    // this.isLoading.set(true); 

    this.transportReportService.scheduleTrip(payload).subscribe({
      next: () => {
        alert('Trip scheduled successfully!');
        this.router.navigate(['transportdashboard/trip-review']);
      },
      error: (err) => {
        alert(`Error scheduling trip: ${err.message}`);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/t-review']);
  }
}