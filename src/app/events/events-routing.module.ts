import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsPage } from './events.page';
import {AuthGuard} from "../auth/auth.guard";

const routes: Routes = [
  {
    path: 'tabs',
    component: EventsPage,
    children: [
      {
        path: 'explore',
        loadChildren: () => import('./explore/explore.module').then( m => m.ExplorePageModule)
      },
      {
        path: 'saved',
        loadChildren: () => import('./saved/saved.module').then( m => m.SavedPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/events/tabs/explore',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/events/tabs/explore',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsPageRoutingModule {}
