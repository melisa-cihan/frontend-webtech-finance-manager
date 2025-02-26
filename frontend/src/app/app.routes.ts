import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssetsComponent } from './assets/assets.component';

export const routes: Routes = [{
        path: "",
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "assets",
        component: AssetsComponent
      }
];
