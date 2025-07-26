import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleResponse } from '../../../../models/Logistic and Transport/VehicleManagement.model';
import { CollectorService } from '../../../../Services/LogisticAndTransport/Collector.service';

@Component({
  selector: 'app-v-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './v-view.component.html',
  styleUrls: ['./v-view.component.scss']
})
export class VehicleViewComponent implements OnInit {
  @Input({ required: true }) vehicle!: VehicleResponse;
  @Output() close = new EventEmitter<void>();
  
  private collectorService = inject(CollectorService);
  assignedCollectorName = signal<string>('Loading...');

  ngOnInit(): void {
    if (this.vehicle.collectorId) {
      this.collectorService.getCollectorById(this.vehicle.collectorId).subscribe({
        next: (collector) => this.assignedCollectorName.set(collector.name),
        error: () => this.assignedCollectorName.set('Not Found')
      });
    } else {
      this.assignedCollectorName.set('Not Assigned');
    }
  }

  closeModal() {
    this.close.emit();
  }
}