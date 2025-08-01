import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CollectorResponse } from '../../../../models/Logistic and Transport/CollectorManagement.model';

@Component({
  selector: 'app-c-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './c-view.component.html',
  styleUrls: ['./c-view.component.scss']
})
export class CollectorViewComponent {
  @Input({ required: true }) collector!: CollectorResponse;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}