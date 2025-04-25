import { Component, Input } from '@angular/core';
import { RytrackComponent } from '../ryReview/ryReview.component';

@Component({
  selector: 'app-ryview',
  templateUrl: './ryView.component.html',
  styleUrls: ['./ryView.component.scss']
})
export class RYViewComponent {
  @Input() route: any;

  closeModal() {
    this.route = null;
  }
}
