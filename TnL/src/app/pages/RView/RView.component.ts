import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-RView',
  standalone: true,
  templateUrl: './RView.component.html',
  styleUrls: ['./RView.component.scss'],
  imports: []
})

export class RViewcomponent implements OnInit {

  searchTerm = signal('');
  selectedFilter = signal('all');
  routes = signal([
    {
      id: 102,
      startLocation: 'Welihena junction',
      endLocation: 'Company',
      distance: '24',
      collectorId: 678,
      vehicleId: 678
    },
    {
      id: 103,
      startLocation: 'Welihena junction',
      endLocation: 'Company',
      distance: '10',
      collectorId: 678,
      vehicleId: 678
    },
    {
      id: 104,
      startLocation: 'Welihena junction',
      endLocation: 'Company',
      distance: '60',
      collectorId: 678,
      vehicleId: 678
    }
  ]);



  filteredRoutes = computed(() => {
    return this.routes().filter(route => {
      const matchesSearch = route.id.toString().includes(this.searchTerm().toLowerCase()) || 
                          this.searchTerm() === '';
  
      const distance = parseInt(route.distance);
      let matchesFilter = true;
      
      switch(this.selectedFilter()) {
        case 'short': matchesFilter = distance < 20; break;
        case 'medium': matchesFilter = distance >= 20 && distance <= 50; break;
        case 'long': matchesFilter = distance > 50; break;
      }
  
      return matchesSearch && matchesFilter;
    });
  });


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
    this.router.navigate(['/rform']);
  }
  routeyield(){
    this.router.navigate(['/trkry'])
  }



  



}
