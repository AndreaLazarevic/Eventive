import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EventModel} from "../event.model";
import {MenuController, ModalController} from "@ionic/angular";
import {EventModalComponent} from "../event-modal/event-modal.component";
import {FilterModalComponent} from "./filter-modal/filter-modal.component";
import {EventsService} from "../events.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {ProfileService} from "../../user-profile/profile.service";
import {Router} from "@angular/router";
import {filter} from "rxjs/operators";
import { IonInfiniteScroll } from "@ionic/angular";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit, OnDestroy {
  events: EventModel[] = [];
  initialEvents: EventModel[] = [];

  public eventListBackup: EventModel[] = [];
  private eventsSub: Subscription;
  role: string;
  isLoading = false;

  addEnabled = false;

  /*@ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  lastKey = 5;
  isFinished = false;*/

  //Needed to memorize filterState
  theatersSelected = false;
  festivalsSelected = false;
  concertsSelected = false;
  sportsSelected = false;


  constructor(private modalCtrl: ModalController,
              private eventsService: EventsService,
              private authService: AuthService,
              private profileService: ProfileService,
              private router: Router,
              private menuController: MenuController,) { }



  ngOnInit() {
    this.isLoading = true;

    if(window.location.pathname === '/events/tabs/explore'){
      this.eventsSub = this.eventsService.allEvents.subscribe((events: EventModel[]) => {

        this.events = events;
        this.eventListBackup = events;
        this.isLoading = false;
      })
    }

    if(window.location.pathname === '/my-events'){
      this.eventsSub = this.eventsService.userEvents.subscribe((events: EventModel[]) => {

        this.events = events;
        this.eventListBackup = events;
        this.isLoading = false;
      })
    }




    console.log("test");


  }

  /*loadData(event){
    if(window.location.pathname === '/events/tabs/explore'){
      this.initialEvents = this.events.slice(0, this.lastKey + 5);


      event.target.complete();

      if(this.events.length === this.initialEvents.length){
        console.log("svi ucitani")
        //this.lastKey = 5;
        this.infiniteScroll.disabled = true;
        this.isFinished = true;
      } else{
        this.lastKey += 5;
      }
    }
  }*/

  ngOnDestroy(): void {
    if(this.eventsSub){
      this.eventsSub.unsubscribe();
    }
  }

  ionViewDidEnter(){

  }

  ionViewWillEnter(){


    this.menuController.swipeGesture(false);

    if(window.location.pathname === '/events/tabs/explore'){
      this.eventsSub = this.eventsService.getEvents().subscribe((events: EventModel[]) => {

        //this.initialEvents = this.events.slice(0,5);
      })
    }

    if(window.location.pathname === '/my-events'){
      this.authService.userId.subscribe(userId => {
        if (userId !== null) {
          this.eventsSub = this.eventsService.getUserEvents(userId).subscribe((events: EventModel[]) => {
            //this.initialEvents = this.events.slice(0,5);
          })
        }
      })
    }


    this.role = this.authService.role;

    if(window.location.pathname === '/my-events'){
      this.addEnabled = true;
    }


    console.log("Page events: " + this.role);

    // Add spinner here

    // Show user only preferred categories:

    this.authService.userId.subscribe(userId => {
      if (userId !== null) {
        this.profileService.getProfile(userId).subscribe((profile) => {
            if(profile.role === 'user' && window.location.pathname === '/events/tabs/explore'){
                let categories = profile.interestedIn;
                for(var i= 0; i < categories.length; i++){
                    if(categories[i]['value'] === 'Theaters') {
                        this.theatersSelected = categories[i]['isItemChecked'];
                    } else if(categories[i]['value'] === 'Festivals') {
                        this.festivalsSelected = categories[i]['isItemChecked'];
                    } else if(categories[i]['value'] === 'Concerts') {
                        this.concertsSelected = categories[i]['isItemChecked'];
                    } else if(categories[i]['value'] === 'Sports') {
                        this.sportsSelected = categories[i]['isItemChecked'];
                    }
                }

                let initialState = {
                    theatersSelected: this.theatersSelected,
                    festivalsSelected: this.festivalsSelected,
                    concertsSelected: this.concertsSelected,
                    sportsSelected: this.sportsSelected,
                }
                this.filterExecute(this.events, initialState);
            }

        })
      }
    })




    /*this.authService.userId.subscribe(uid => {
      if (uid !== null) {

        this.profileService.getRole(uid).subscribe((role) => {
            this.role = role;

            console.log(this.role);
          }
        );
      }

      this.role = 'guest';
    })*/
  }


  openModal(){
    this.modalCtrl.create({
      component: EventModalComponent,
      componentProps: { title: 'Add event'}

    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((resultData) => {
      if(resultData.role === 'confirm'){
        console.log(resultData);

        let {name, startingDate, endingDate, location, description, imageUrl,
          category, moreDetails} = resultData.data.eventData;

        this.eventsService
            .addEvent(name, startingDate, endingDate, location, description, imageUrl,  category, moreDetails)
            .subscribe(events => {
              console.log(events);
              //this.events = events;
            }

        );
      }
    });
  }

  onLogOut(){
    this.authService.logOut();
    this.router.navigateByUrl('/home').then(() => {
      window.location.reload();
    });
  }

  async filterEvents(evt) {
    this.events = this.eventListBackup;
    const searchTerm = evt.target.value;

    if (!searchTerm) {
      return ;
    }

    this.events = this.events.filter(currentEvent => {
      if (currentEvent.name && searchTerm) {
        return (currentEvent.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  reverseOrder(){

  }

  openFilterModal(){
    this.modalCtrl.create({
      component: FilterModalComponent,
      componentProps: {
        theatersSelected: this.theatersSelected,
        festivalsSelected: this.festivalsSelected,
        concertsSelected: this.concertsSelected,
        sportsSelected: this.sportsSelected,
      }
    }).then((modal) => {
      modal.present();
      return modal.onDidDismiss();
    }).then((filterResult) => {
      if(filterResult.role === 'confirmed') {
        //console.log(filterResult.data.filterState.sportsSelected);

        this.eventsService.getEvents()
            .subscribe((allEvents: EventModel[]) => {
              this.filterExecute(allEvents, filterResult.data.filterState);
              //this.filterExecute(allEvents, filterResult);
            })
      }

    })
  }


  filterExecute(allEvents, filterState){
    let eventsFiltered = [];

    // Reset values to save next state
    this.theatersSelected = false;
    this.concertsSelected = false;
    this.festivalsSelected = false;
    this.sportsSelected = false;

    if(filterState.theatersSelected){
      this.theatersSelected = true;
      eventsFiltered = eventsFiltered.concat(allEvents.filter((event) => {
        return event.category === "Theaters";
      }));
    }

    if(filterState.concertsSelected){
      this.concertsSelected = true;
      eventsFiltered = eventsFiltered.concat(allEvents.filter((event) => {
        return event.category === "Concerts";
      }));
    }

    if(filterState.festivalsSelected){
      this.festivalsSelected = true;
      eventsFiltered = eventsFiltered.concat(allEvents.filter((event) => {
        return event.category === "Festivals";
      }));
    }

    if(filterState.sportsSelected){
      this.sportsSelected = true;
      eventsFiltered = eventsFiltered.concat(allEvents.filter((event) => {
        return event.category === "Sports";
      }));
    }

    this.events= eventsFiltered;
  }

}
