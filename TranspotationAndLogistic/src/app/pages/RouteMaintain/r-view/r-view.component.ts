import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RtList } from '../../../models/Logistic and Transport/RouteMaintain.model'; // adjust import path

@Component({
  selector: 'app-r-view',
  standalone: true,
  templateUrl: './r-view.component.html',
  styleUrls: ['./r-view.component.scss']
})
export class RtViewComponent {
  @Input() route: RtList | null = null;
  @Output() close = new EventEmitter<void>();
}
