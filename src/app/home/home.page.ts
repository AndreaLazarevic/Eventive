import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {tap} from "rxjs/operators";
import {User} from "../auth/user.model";
import {AuthResponseData} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {MenuController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private menuController: MenuController,) { }

  ngOnInit() {

  }


  guestMode(){

  }

  ionViewWillEnter() {
    this.menuController.swipeGesture(false);
  }

  ionViewDidEnter() {
  }

}
