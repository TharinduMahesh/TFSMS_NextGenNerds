import { Component, Input } from '@angular/core';
import { RytrackComponent } from '../RYTrack/RYtrack.component';

@Component({
  selector: 'app-ryview',
  templateUrl: './ryview.component.html',
  styleUrls: ['./ryview.component.scss']
})
export class RYViewComponent {
  @Input() route: any;

  closeModal() {
    this.route = null;
  }
}
