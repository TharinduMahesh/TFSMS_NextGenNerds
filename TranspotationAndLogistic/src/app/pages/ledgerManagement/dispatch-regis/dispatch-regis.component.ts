import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DispatchRegisterService } from '../../../services/LedgerManagement/dispatch-register.service'; // Adjust paths
import { Dispatch } from '../../../models/Ledger Management/dispatch-register.model';

@Component({
  selector: 'app-dispatch-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispatch-regis.component.html',
  styleUrls: ['./dispatch-regis.component.scss']
})
export class DispatchRegisterComponent {
  private dispatchService = inject(DispatchRegisterService);
  private location = inject(Location);

  // Form Data Signals
  gardenMark = signal('');
  driverNic = signal('');
  vehicleNumber = signal('');
  bagCount = signal<number | null>(null);
  dispatchDate = signal('');
  sealNumber = signal('');

  // Validation Signals
  gardenMarkError = computed(() => !this.gardenMark() ? 'Garden Mark is required' : '');
  driverNicError = computed(() => !this.driverNic() ? 'Driver NIC is required' : '');
  vehicleNumberError = computed(() => !this.vehicleNumber() ? 'Vehicle Number is required' : '');
  dispatchDateError = computed(() => !this.dispatchDate() ? 'Dispatch Date is required' : '');
  sealNumberError = computed(() => !this.sealNumber() ? 'Seal Number is required' : '');
  bagCountError = computed(() => {
    const count = this.bagCount();
    if (count === null || count === undefined) return 'Bag Count is required';
    if (count <= 0) return 'Bag Count must be greater than 0';
    return '';
  });

  isFormValid = computed(() => 
    !this.gardenMarkError() && !this.driverNicError() && !this.vehicleNumberError() &&
    !this.bagCountError() && !this.dispatchDateError() && !this.sealNumberError()
  );

  // Data from service
  records = this.dispatchService.dispatches;

  onSubmit(): void {
    if (this.isFormValid()) {
      const newRecord: Omit<Dispatch, 'id' | 'dispatchNo'> = {
        gardenMark: this.gardenMark(),
        driverNic: this.driverNic(),
        vehicleNumber: this.vehicleNumber(),
        bagCount: this.bagCount()!,
        dispatchDate: this.dispatchDate(),
        sealNumber: this.sealNumber()
      };
      this.dispatchService.addDispatch(newRecord);
      this.clearForm();
    }
  }

  clearForm(): void {
    this.gardenMark.set('');
    this.driverNic.set('');
    this.vehicleNumber.set('');
    this.bagCount.set(null);
    this.dispatchDate.set('');
    this.sealNumber.set('');
  }

  onExit(): void {
    this.location.back();
  }
}