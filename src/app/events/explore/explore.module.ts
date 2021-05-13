import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';

import { ExplorePage } from './explore.page';
import {EventElementComponent} from "../event-element/event-element.component";
import {EventModalComponent} from "../event-modal/event-modal.component";
import {FilterModalComponent} from "./filter-modal/filter-modal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorePageRoutingModule
  ],
  declarations: [ExplorePage, EventElementComponent, EventModalComponent, FilterModalComponent],
  entryComponents: [EventModalComponent]
})
export class ExplorePageModule {}
