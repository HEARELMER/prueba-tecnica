import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'register',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/registration/registration-page.component').then(
        (m) => m.RegistrationPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'register',
  },
];
