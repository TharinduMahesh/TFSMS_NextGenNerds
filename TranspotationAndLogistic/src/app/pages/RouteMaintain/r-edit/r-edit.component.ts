import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Rview, GrowerLocation } from '../../../models/rview.model';

@Component({
  selector: 'app-r-edit',
  standalone: true,
  templateUrl: './r-edit.component.html',
  styleUrls: ['./r-edit.component.scss']
})
export class RtEditComponent {
  private isOpen = signal(false);

  @Input() set route(value: Rview | null) {
    if (value) {
      this.formModel.set({ ...value });
      this.open();
    }
  }

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Rview>();

  formModel = signal<Rview>({
    rId: 0,
    rName: '',
    startLocation: '',
    endLocation: '',
    distance: '',
    collectorId: 0,
    vehicleId: 0,
    growerLocations: []
  });

  formData = this.formModel.asReadonly();

  get modalVisible() {
    return this.isOpen();
  }

  open() {
    this.isOpen.set(true);
  }

  closeModal() {
    this.isOpen.set(false);
    this.close.emit();
  }

  handleInput(field: keyof Rview, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.formModel.update(model => ({
      ...model,
      [field]: field === 'collectorId' || field === 'vehicleId' ? Number(value) : value
    }));
  }

  updateGrowerDescription(gId: number | undefined, event: Event): void {
    const newDescription = (event.target as HTMLInputElement).value;
    if (gId === undefined) return;

    this.formModel.update(model => ({
      ...model,
      growerLocations: model.growerLocations?.map(loc =>
        loc.gId === gId ? { ...loc, description: newDescription } : loc
      ) ?? []
    }));
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const formData = this.formModel();
    if (!formData.rId) {
      console.error('Cannot update route without ID');
      return;
    }

    const payload: Rview = {
      ...formData,
      growerLocations: formData.growerLocations.map(loc => ({
        ...loc,
        RtListId: formData.rId
      }))
    };

    this.save.emit(payload);
    this.closeModal();
    
  }

  onCancel(): void {
    this.closeModal();
  }

  // Helper to get grower location by index safely
  getGrowerLocation(index: number): GrowerLocation | null {
    const locations = this.formModel().growerLocations;
    return locations && index < locations.length ? locations[index] : null;
  }
}
