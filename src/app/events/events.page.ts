import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, AngularFireObject} from "@angular/fire/database";
import {UserProfile} from "../user-profile/user-profile.model";
import {AuthService} from "../auth/auth.service";
import {map} from "rxjs/operators";
import {EventModel} from "./event.model";
import {HttpClient} from "@angular/common/http";
import {ProfileService} from "../user-profile/profile.service";
import {EventsService} from "./events.service";

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  role: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {

  }

  ionViewWillEnter(){

    this.role = this.authService.role;
    console.log("Page events main: " + this.role);

  }


}
