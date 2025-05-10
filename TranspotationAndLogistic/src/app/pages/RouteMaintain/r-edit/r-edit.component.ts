import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Rview } from '../../../models/rview.model';

@Component({
  selector: 'app-r-edit',
  standalone: true,
  templateUrl: './r-edit.component.html',
  styleUrls: ['./r-edit.component.scss'],
})
export class RtEditComponent {
  @Input() route: Rview | null = null;
  @Input() close: () => void = () => {};

  formData: WritableSignal<Rview | null> = signal(null);

  ngOnInit() {
    if (this.route) {
      // Deep copy to prevent mutating original
      this.formData.set(JSON.parse(JSON.stringify(this.route)));
    }
  }

  handleInput(field: keyof Rview, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const data = this.formData();
    if (data) {
      this.formData.set({ ...data, [field]: value });
    }
  }

  updateGrowerDescription(gId: number | undefined, newDesc: string): void {
    if (gId === undefined) return; // Ignore or handle differently if needed
    const updated = this.formData().growerLocations.map(loc =>
      loc.gId === gId ? { ...loc, description: newDesc } : loc
    );
    this.formModel.update(current => ({
      ...current,
      growerLocations: updated
    }));
  }
  

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Updated Route:', this.formData());
    this.close(); // Trigger close modal after save
  }

  onCancel(): void {
    this.close(); // Trigger close modal
  }
}
