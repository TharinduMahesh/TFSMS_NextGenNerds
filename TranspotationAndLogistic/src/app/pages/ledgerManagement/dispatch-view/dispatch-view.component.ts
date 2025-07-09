import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DispatchRegisterService } from '../../../services/LedgerManagement/dispatch-view.service';

@Component({
  selector: 'app-dispatch-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispatch-view.component.html',
  styleUrls: ['./dispatch-view.component.scss']
})
export class DispatchViewComponent {
  private dispatchService = inject(DispatchRegisterService);
  private location = inject(Location);

  // Local signals to bind to the search input fields
  gardenMarkSearch = signal('');
  vehicleNumberSearch = signal('');
  driverNicSearch = signal('');

  // The records to display in the table, taken directly from the service's computed signal
  records = this.dispatchService.filteredDispatches;

  constructor() {
    // An effect that runs whenever a search term changes.
    // It calls the service to update the filters.
    effect(() => {
      this.dispatchService.setFilters({
        gardenMark: this.gardenMarkSearch(),
        vehicleNumber: this.vehicleNumberSearch(),
        driverNic: this.driverNicSearch()
      });
    });
  }

  onExit(): void {
    this.location.back();
  }
}