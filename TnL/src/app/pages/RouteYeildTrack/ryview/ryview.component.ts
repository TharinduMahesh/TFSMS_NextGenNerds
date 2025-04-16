import { Component, Input } from '@angular/core';

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
