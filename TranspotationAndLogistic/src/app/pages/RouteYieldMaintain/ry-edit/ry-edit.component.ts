import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { YieldResponse, YieldPayload } from '../../../models/RouteYeildMaintain.model';
import { RyService } from '../../../services/RouteYieldMaintainService/RouteYieldMaintain.service';

@Component({
  selector: 'app-ryedit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ry-edit.component.html',
  styleUrls: ['./ry-edit.component.scss']
})
export class RyEditComponent implements OnInit {
  private ryService = inject(RyService);
  private fb = inject(FormBuilder);

  @Input({ required: true }) route!: YieldResponse; // Use correct model
  @Output() close = new EventEmitter<boolean>(); // true on success, false on cancel

  form!: FormGroup;

  ngOnInit(): void {
    // Form matches the API payload, with your validations preserved
    this.form = this.fb.group({
      collected_Yield: [this.route.collected_Yield, [Validators.required, Validators.min(0)]],
      golden_Tips_Present: [this.route.golden_Tips_Present, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
  
    const formValues = this.form.getRawValue();

    // The API needs the rId, which is not editable on this form
    const payload: YieldPayload = {
      rId: this.route.rId,
      collected_Yield: formValues.collected_Yield,
      golden_Tips_Present: formValues.golden_Tips_Present
    };

    // Update using the unique yield ID (yId)
    this.ryService.updateYieldList(this.route.yId, payload).subscribe({
      next: () => {
        this.close.emit(true); // Signal success
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Update failed. See console for details.');
      }
    });
  }

  onCancel(): void {
    this.close.emit(false); // Signal cancellation
  }
}