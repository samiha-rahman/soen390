import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home-temp', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  {
    path: 'bus',
    loadChildren: () => import('src/app/components/bus/bus.module').then(m => m.BusPageModule)
  },
  {
    path: 'appsettings',
    loadChildren: () => import('src/app/pages/app-settings/app-settings.module').then(m => m.AppsettingsPageModule)
  },
  {
    path: 'outdoor',
    loadChildren: () => import('./components/outdoor/outdoor.module').then( m => m.OutdoorPageModule)
  },
  {
    path: 'demo',
    loadChildren: () => import('./pages/demo-indoor-nav/demo-indoor-nav.module').then( m => m.DemoIndoorNavPageModule)
  },
  {
    path: 'home-temp',
    loadChildren: () => import('./pages/home-temp/home-temp.module').then( m => m.HomeTempPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
