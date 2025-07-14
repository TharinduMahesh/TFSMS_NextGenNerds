import { Injectable, signal, computed } from '@angular/core';
import { Dispatch } from '../../models/LedgerManagement/dispatch-register.model'; // Adjust path

@Injectable({
  providedIn: 'root'
})
export class DispatchRegisterService {

  private allDispatches = signal<Dispatch[]>([
    
    { id: '1', dispatchNo: 1, gardenMark: 'GM001', vehicleNumber: 'AB123', driverNic: '123456789V', bagCount: 50, dispatchDate: '2024-10-26', sealNumber: 'SN001' },
    { id: '2', dispatchNo: 2, gardenMark: 'GM002', vehicleNumber: 'CD456', driverNic: '987654321V', bagCount: 30, dispatchDate: '2024-10-26', sealNumber: 'SN002' },
    { id: '3', dispatchNo: 3, gardenMark: 'GM002', vehicleNumber: 'EF789', driverNic: '123987654V', bagCount: 40, dispatchDate: '2024-10-27', sealNumber: 'SN003' },
    { id: '4', dispatchNo: 4, gardenMark: 'GM003', vehicleNumber: 'GH111', driverNic: '555444333V', bagCount: 65, dispatchDate: '2024-10-28', sealNumber: 'SN004' }
  ]);

  // Private signals to hold the current filter values
  private gardenMarkFilter = signal('');
  private vehicleNumberFilter = signal('');
  private driverNicFilter = signal('');

  // Public computed signal that the component will display.
  // It automatically recalculates whenever the master list or any filter changes.
  public filteredDispatches = computed(() => {
    const all = this.allDispatches();
    const gmFilter = this.gardenMarkFilter().toLowerCase();
    const vhFilter = this.vehicleNumberFilter().toLowerCase();
    const nicFilter = this.driverNicFilter().toLowerCase();

    // If all filters are empty, return the full list
    if (!gmFilter && !vhFilter && !nicFilter) {
      return all;
    }

    // Apply filters sequentially
    return all.filter(dispatch => {
      const gardenMarkMatch = gmFilter ? dispatch.gardenMark.toLowerCase().includes(gmFilter) : true;
      const vehicleNumberMatch = vhFilter ? dispatch.vehicleNumber.toLowerCase().includes(vhFilter) : true;
      const driverNicMatch = nicFilter ? dispatch.driverNic.toLowerCase().includes(nicFilter) : true;
      
      return gardenMarkMatch && vehicleNumberMatch && driverNicMatch;
    });
  });

  constructor() { }

  // A public method for the component to update the filter values
  setFilters(filters: { gardenMark: string; vehicleNumber: string; driverNic: string; }): void {
    this.gardenMarkFilter.set(filters.gardenMark);
    this.vehicleNumberFilter.set(filters.vehicleNumber);
    this.driverNicFilter.set(filters.driverNic);
  }
}