import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'bus',
    loadChildren: () => import('src/app/components/bus/bus.module').then(m => m.BusPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('src/app/pages/app-settings/app-settings.module').then(m => m.AppsettingsPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomeTempPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
