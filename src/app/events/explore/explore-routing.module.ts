import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplorePage } from './explore.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorePage
  },
  {
    path: ':eventId',
    loadChildren: () => import('./event-details/event-details.module').then( m => m.EventDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorePageRoutingModule {}
