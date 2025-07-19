import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YieldResponse } from '../../../models/Logistic and Transport/RouteYeildMaintain.model';

@Component({
  selector: 'app-ry-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ry-view.component.html',
  styleUrls: ['./ry-view.component.scss']
})
export class RyViewComponent {
  @Input({ required: true }) yieldData!: YieldResponse;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}