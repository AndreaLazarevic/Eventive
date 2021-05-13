import { Component, OnInit } from '@angular/core';
import {EventModel} from "../../event.model";
import {ActivatedRoute} from "@angular/router";
import {LoadingController, ModalController, NavController} from "@ionic/angular";
import {EventsService} from "../../events.service";
import {EventModalComponent} from "../../event-modal/event-modal.component";
import {AuthService} from "../../../auth/auth.service";
import {ProfileService} from "../../../user-profile/profile.service";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {

  event: EventModel;
  isLoading = false;
  role: string;
  editAndDeleteEnabled = false;


    constructor(private route: ActivatedRoute,
              private navCtrl: NavController,
              private eventsService: EventsService,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
                private authService: AuthService,
                private profileService: ProfileService) { }

  ngOnInit() {
      this.route.paramMap.subscribe((paramMap) => {
          if(!paramMap.has('eventId')){
              this.navCtrl.navigateBack('/events/tabs/explore');

              return;
          }

          this.isLoading = true;
          this.eventsService.getEvent(paramMap.get('eventId'))
              .subscribe((event) => {
                  this.event = event;
                  this.isLoading = false;
                  }
              );
      })

  }

    ionViewWillEnter(){

        this.role = this.authService.role;
        console.log("Page event details: " + this.role);

        if(window.location.pathname.startsWith('/my-events')){
            this.editAndDeleteEnabled = true;
        }

        if(window.location.pathname.startsWith('/events/tabs/explore') && this.role === 'admin'){
            this.editAndDeleteEnabled = true;
        }

        /*this.authService.userId.subscribe(uid => {
            this.profileService.getRole(uid).subscribe((role) => {
                    this.role = role;
                    console.log(this.role);
                }
            );
        })*/
    }

    onDeleteEvent(){
      this.loadingCtrl.create({message: 'Deleting...'})
          .then((loadingEl) => {
              loadingEl.present();
              this.eventsService.deleteEvent(this.event.id).subscribe(() => {
                  loadingEl.dismiss();
                  this.navCtrl.navigateBack('/events/tabs/explore');
              });
          });


    }

    onEditEvent(){
        this.modalCtrl.create({
            component: EventModalComponent,
            componentProps: {
                title: 'Edit event',
                name: this.event.name,
                startingDate: this.event.startingDate,
                endingDate: this.event.endingDate,
                location: this.event.location,
                description: this.event.description,
                imageUrl: this.event.imageUrl,
                category: this.event.category,
                moreDetails: this.event.moreDetails,
                valid: this.event.valid
            }

        }).then((modal) => {
            modal.present();
            return modal.onDidDismiss();
        }).then((resultData) => {
            if(resultData.role === 'confirm'){
                console.log(resultData);

                let {name, startingDate, endingDate, location, description, imageUrl,
                    category, moreDetails, valid} = resultData.data.eventData;

                this.eventsService.editEvent(this.event.id, name, startingDate,
                    endingDate, location, description, imageUrl,  category, moreDetails, valid, this.event.userId)
                    .subscribe((res) => {
                        this.event.name = name;
                        this.event.startingDate = startingDate;
                        this.event.endingDate = endingDate;
                        this.event.location = location;
                        this.event.description = description;
                        this.event.imageUrl = imageUrl;
                        this.event.category = category;
                        this.event.moreDetails = moreDetails;
                        this.event.valid = valid;

                    });
            }
        });
    }

}
