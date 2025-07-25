import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { RtList } from '../../../models/Logistic and Transport/RouteMaintain.model';

@Component({
  selector: 'app-r-view',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './r-view.component.html',
  styleUrls: ['./r-view.component.scss']
})
export class RtViewComponent {
  @Input() route: RtList | null = null;
  @Output() close = new EventEmitter<void>();
}