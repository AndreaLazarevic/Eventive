import {Component, Input, OnInit} from '@angular/core';
import {EventModel} from "../event.model";
import {AlertController} from "@ionic/angular";
import {AuthService} from "../../auth/auth.service";
import {ProfileService} from "../../user-profile/profile.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-event-element',
  templateUrl: './event-element.component.html',
  styleUrls: ['./event-element.component.scss'],
})
export class EventElementComponent implements OnInit {
  @Input() event: EventModel;
  role: string;
  //icon = 'bookmark-outline';
  icon = '';
  iconVisible = true;

  constructor(private alertCtrl: AlertController,
              private authService: AuthService,
              private profileService: ProfileService) { }

  ngOnInit() {
    this.icon = 'bookmark-outline';

    if(window.location.pathname === '/my-events'){
      this.iconVisible = false;
    }

    this.authService.userId.subscribe(uid => {
      if (uid !== null) {

        this.profileService.getRole(uid).subscribe((role) => {
              this.role = role;
              console.log(this.role);
            }
        );

        this.profileService.getSavedEventsIdsForCurrentUser(uid).subscribe((savedEvents) => {
          //console.log("test prikaza ikonice");
          //let temp: [] = savedEvents;
            for (let id in savedEvents) {
              if (id === this.event.id) {
                this.icon = 'bookmark-sharp';
                break;
              } else {
                this.icon = 'bookmark-outline';
              }
            }


        });
      }
    })
  }

  openAlert(event){

    event.stopPropagation();
    event.preventDefault();

    this.alertCtrl.create({
      header: 'Saving event',
      message: 'Are you sure you want to save this event?',
      buttons: [
        {
          text: 'Save',
          handler: () => {
            this.icon = 'bookmark-sharp'
            console.log('saved');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancelled');
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  removeOrAdd(event){
    event.stopPropagation();
    event.preventDefault();

    if(this.icon === 'bookmark-sharp'){
      this.profileService.removeFromSaved(this.event.id);
      this.icon = 'bookmark-outline';
    }else if(this.icon === 'bookmark-outline'){
      this.profileService.addToSaved(this.event.id);
      this.icon = 'bookmark-sharp';
    }


  }

  ionViewWillEnter(){

  }

}
