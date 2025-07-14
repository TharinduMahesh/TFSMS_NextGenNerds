import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RyService } from '../../../services/LogisticAndTransport/RouteYieldMaintain.service';
import { YieldPayload, YieldResponse } from '../../../models/Logistic and Transport/RouteYeildMaintain.model';

@Component({
  selector: 'app-ry-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ry-edit.component.html',
  styleUrls: ['./ry-edit.component.scss']
})
export class RyEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ryService = inject(RyService);

  editForm: FormGroup;
  currentYield: YieldResponse | null = null;
  isLoading = true;

  constructor() {
    this.editForm = this.fb.group({
      collected_Yield: ['', Validators.required],
      golden_Tips_Present: ['false', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) throw new Error('Yield ID is required.');
        return this.ryService.getYieldListById(+id);
      })
    ).subscribe({
      next: (yieldData) => {
        this.currentYield = yieldData;
        this.editForm.patchValue({
          collected_Yield: yieldData.collected_Yield,
          golden_Tips_Present: yieldData.golden_Tips_Present.toString()
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.currentYield) return;

    const payload: YieldPayload = {
      rId: this.currentYield.rId,
      collected_Yield: this.editForm.value.collected_Yield,
      golden_Tips_Present: this.editForm.value.golden_Tips_Present,
    };

    this.ryService.updateYieldList(this.currentYield.yId, payload).subscribe({
      next: () => {
        alert('Yield updated successfully!');
        this.router.navigate(['/ry-review']);
      },
      error: (err) => alert(`Error updating yield: ${err.message}`)
    });
  }

  onCancel(): void {
    this.router.navigate(['/ry-review']);
  }
}