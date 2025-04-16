import { Routes } from '@angular/router';
import { RytrackComponent } from './pages/RouteYeildTrack/RYTrack/RYtrack.component';
import { CManagementComponent } from './pages/CostManagement/CManagement/cmanagement.component';
import { CMformComponent } from './pages/CostManagement/cmform/cmform.component';
import { PmformComponent } from './pages/PerformanceMonitoring/pmform/pmform.component';
import { PfmComponent } from './pages/PerformanceMonitoring/PMonitering/pmonitering.component';
import { RFormComponent } from './pages/RouteManipulation/rform/rform.component';
import { RYformComponent } from './pages/RouteYeildTrack/RYform/RYform.component';
import { RViewComponent } from './pages/RouteManipulation/RView/RView.component';
import { RYViewComponent } from './pages/RouteYeildTrack/ryview/ryview.component';

export const routes: Routes = [
    {
      path : 'ryview',
      component : RYViewComponent
    },
    {
      path : 'rview',
      component :RViewComponent
    },
  {
    path : 'rform',
    component: RFormComponent
  },
  {
    path : 'ryform',
    component: RYformComponent
  },
  {
    path : 'rytrack',
    component : RytrackComponent
  },
  {
    path : 'cmanagement',
    component : CManagementComponent
  },
  {
    path : 'cmform',
    component : CMformComponent
  },
  {
    path : 'pmform',
    component : PmformComponent
  },
  {
    path : 'pmonitering',
    component : PfmComponent
  }
  ];