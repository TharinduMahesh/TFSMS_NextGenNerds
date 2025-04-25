import { Component, Input } from '@angular/core';
import { RyReviewComponent } from '../ry-review/ry-review.component';

@Component({
  selector: 'app-ryview',
  templateUrl: './ry-view.component.html',
  styleUrls: ['./ry-view.component.scss']
})
export class RyViewComponent {
  @Input() route: any;

  closeModal() {
    this.route = null;
  }
}
