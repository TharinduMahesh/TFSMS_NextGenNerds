import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-slidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './slidebar.component.html',
  styleUrls: ['./slidebar.component.scss']
})
export class SidebarComponent {
  imglink: string = "https://th.bing.com/th/id/OIP.NqY3rNMnx2NXYo3KJfg43gHaHa?rs=1&pid=ImgDetMain";
}
