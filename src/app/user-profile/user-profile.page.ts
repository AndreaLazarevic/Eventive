import { Component, OnInit } from '@angular/core';
import {UserProfile} from "./user-profile.model";
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase } from '@angular/fire/database'
import {NavController} from "@ionic/angular";
import {isEmpty, map, switchMap, take, tap} from "rxjs/operators";

import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {EventModel} from "../events/event.model";
import {HttpClient} from "@angular/common/http";
import {ProfileService} from "./profile.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  profile = {} as UserProfile;
  previously_registered: boolean;

  indeterminateState: boolean;
  checkParent: boolean;
  Checkboxes: any;
  //checkboxes: any;

  constructor(private profileService: ProfileService,
              private authService: AuthService,
              private router: Router) {

      this.Checkboxes = [
          {
              value: "Theaters",
              isItemChecked: true,
          }, {
              value: "Festivals",
              isItemChecked: true,
          }, {
              value: "Concerts",
              isItemChecked: true,
          }, {
              value: "Sports",
              isItemChecked: true,
          }
      ];

      //this.checkboxes = [{Theaters : true}, {Festivals : true}, {Concerts : true}, {Sports : true}]
  }

  ngOnInit() {

    this.authService.userId.subscribe(uid => {
        if(uid !== null) {
            this.profileService.getProfile(uid).subscribe((profile) => {
                if(profile.firstName !== undefined){
                    this.profile = profile;
                    this.previously_registered = true;
                    this.Checkboxes = this.profile.interestedIn;
                } else{
                    this.previously_registered = false;
                }
            });
        }
    });




  }

  ionViewWillEnter(){
      /*if(){
          this.previously_registered = false;
      } else {
          this.previously_registered = true;
      }*/
  }

  onCreateProfile(){
      let message = 'Your profile is created successfully.';
      this.profileService.updateProfile(this.profile, this.Checkboxes, message);
      this.router.navigateByUrl('/log-in', {replaceUrl: true});
  }

  onUpdateProfile(){
      let message = 'Your profile is updated successfully.';
      this.profileService.updateProfile(this.profile, this.Checkboxes, message);
  }

  checkCheckbox() {
      setTimeout(() => {
          this.Checkboxes.forEach(item => {
              item.isItemChecked = this.checkParent;
          });
      });
  }

  verifyEvent() {
      const allItems = this.Checkboxes.length;
      let selected = 0;

      this.Checkboxes.map(item => {
          if (item.isItemChecked) selected++;
      });

      if (selected > 0 && selected < allItems) {
          // One item is selected among all checkbox elements
          this.indeterminateState = true;
          this.checkParent = false;
      } else if (selected == allItems) {
          // All item selected
          this.checkParent = true;
          this.indeterminateState = false;
      } else {
          // No item is selected
          this.indeterminateState = false;
          this.checkParent = false;
      }


  }

}
