import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Rview } from '../../../models/rview.model'; // adjust import path

@Component({
  selector: 'app-r-view',
  standalone: true,
  templateUrl: './r-view.component.html',
  styleUrls: ['./r-view.component.scss']
})
export class RtViewComponent {
  @Input() route: Rview | null = null;
  @Output() close = new EventEmitter<void>();
}
