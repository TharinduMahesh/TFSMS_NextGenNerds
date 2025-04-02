import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-route-yield',
  standalone: true,
  templateUrl: './routeyield.component.html',
  styleUrls: ['./routeyield.component.scss'],
  imports: []
})
export class trkryCompoenet implements OnInit {
  routes = [
    {
      id: 102,
      routeName: 'Route A',
      distance: '24km',
      collectorId: 678,
      vehicleId: 678,
      collectedyield: 80,
      gtpresent:1300
    },
    {
      id: 102,
      routeName:'Route B',
      collectorId: 678,
      vehicleId: 678,
      collectedyield: 80,
      gtpresent:1300
    },
    {
      id: 102,
      routeName:'Route C',
      collectorId: 678,
      vehicleId: 678,
      collectedyield: 80,
      gtpresent:1300
    }
  ];
console: any;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onView(routeId: number) {
    console.log('View Route:', routeId);
  }

  onEdit(routeId: number) {
    console.log('Edit Route:', routeId);
  }

  onDelete(routeId: number) {
    console.log('Delete Route:', routeId);
  }
  AddNewRoute() {
    this.router.navigate(['/add-route']);
  }
}
