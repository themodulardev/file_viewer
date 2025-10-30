import { Routes } from '@angular/router';
import { AdminLayout } from './admin-layout/admin-layout';
import { Dashboard } from './admin/dashboard/dashboard';
import { AdminLogin } from './admin/admin-login/admin-login';
import { authGuard } from './utils/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: '', component: Dashboard }, // Default child route
      { path: 'dashboard', component: Dashboard }
    ]
  },
  {
    path: '',
    component: AdminLogin,
    canActivate: [
      authGuard
    ]
  },
  // {
  //   path: '',
  //   redirectTo: 'admin',
  //   pathMatch: 'full'
  // }
];
