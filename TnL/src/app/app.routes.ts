import { Routes } from '@angular/router';
import { RViewcomponent } from './pages/RView/RView.component';
import { trkryCompoenet } from './pages/RYTrack/routeyield.component';
import { CManagementComponent } from './pages/CManagement/cmanagement.component';
import { CMformComponent } from './pages/cmform/cmform.component';
import { PmformComponent } from './pages/pmform/pmform.component';
import { PfmComponent } from './pages/PMonitering/pmonitering.component';
import { RFormComponent } from './pages/rform/rform.component';
import { RYformComponent } from './pages/RYform/RYform.component';
export const routes: Routes = [
  {
    path : 'rview',
    component : RViewcomponent
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
    component : trkryCompoenet
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