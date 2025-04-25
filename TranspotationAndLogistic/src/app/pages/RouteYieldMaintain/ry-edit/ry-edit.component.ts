import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { YieldList } from '../../../models/rview.model';
import { RyService } from '../../../services/RouteYieldMaintainService/RouteYieldMaintain.service';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ryedit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ry-edit.component.html',
  styleUrls: ['./ry-edit.component.scss']
})
export class RyEditComponent implements OnInit {
  private ryService = inject(RyService);

  private fb = inject(NonNullableFormBuilder);

  @Input() route!: YieldList;
  @Output() close = new EventEmitter<void>();

  form = this.fb.group({
    routeId: [0],
    routeName: ['', Validators.required],
    collected_Yield: ['', Validators.required],
    golden_Tips_Present: ['false'],
    collectorID: [0, Validators.required],
    vehicalID: [0, Validators.required]
  });
  

  ngOnInit(): void {
    if (this.route) {
      this.form.patchValue(this.route);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const updatedRoute: YieldList = {
        ...this.form.getRawValue()
      };
  
      this.ryService.updateYieldList(updatedRoute.routeId, updatedRoute).subscribe({
        next: () => this.close.emit(),
        error: (err) => console.error('Update failed', err)
      });
    }
  }
  
  
  

  onCancel(): void {
    this.close.emit();
  }
}
