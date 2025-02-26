import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TableComponent } from './table/table.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent, 
        pathMatch: 'full'
    },
    {
        path: 'assets', 
        component: TableComponent
    },
    {
        path: 'dashboard', 
        component: DashboardComponent
    },
    
];
