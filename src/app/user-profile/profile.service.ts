import { Injectable } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {UserProfile} from "./user-profile.model";
import {AngularFireDatabase} from "@angular/fire/database";
import {Router} from "@angular/router";
import {map, switchMap, take, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import { AlertController } from '@ionic/angular';
import {EventsService} from "../events/events.service";
import {EventModel} from "../events/event.model";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private afDatabase: AngularFireDatabase,
              private authService: AuthService,
              private router: Router,
              private http: HttpClient,
              private eventsService: EventsService,
              public alertController: AlertController) { }

  createProfile(profile: UserProfile, checkboxes: any){
    profile.role = 'user';
    profile.interestedIn = checkboxes;
    profile.savedEvents = [];
    profile.savedEvents["test"] = true;

    this.authService.userId.subscribe(val => {
      console.log(val);
      this.afDatabase.object(`profile/${val}`).set(profile)
    });

      // take(1) dodati
  }

  updateProfile(profile: UserProfile, checkboxes: any, message: string){
      profile.role = 'user';
      profile.interestedIn = checkboxes;

      this.authService.userId.subscribe(userId => {
          this.afDatabase.object(`profile/${userId}`).update(profile)});

      const alert = this.alertController.create({
          header: 'Success!',
          message: message,
          buttons: ['OK'],
      }).then((alert) => {
          alert.present();
      });

  }



  getProfile(id: string){
      return this.http.get<UserProfile>(`https://app-mobilno.firebaseio.com/profile/${id}.json`)
          .pipe(map((resData) => {
              if(resData != null){
                  return new UserProfile(id, resData.firstName,
                      resData.lastName,
                      resData.role,
                      resData.notifications,
                      resData.interestedIn,
                      resData.savedEvents);
              }
              else{
                  return null;
              }

          }));
  }

  getRole(id: string){
    return this.http.get<UserProfile>(`https://app-mobilno.firebaseio.com/profile/${id}.json`)
        .pipe(map((resData) => {
          if(resData != null)
            return resData.role;
        }));
  }

  getSavedEventsIdsForCurrentUser(userId){
        return this.http.get<UserProfile>(`https://app-mobilno.firebaseio.com/profile/${userId}.json`)
            .pipe(map((resData) => {
                if (resData != null) {
                    return resData.savedEvents;
                }
            }));
  }



    getSavedEventsForCalendar(userId){
      let events: EventModel[];
        this.eventsService.allEvents.subscribe((allEvents) => {
            events = allEvents;
        })

        return this.http.get<UserProfile>(`https://app-mobilno.firebaseio.com/profile/${userId}.json`)
            .pipe(map((resData) => {
                let filtered: EventModel[] = [];
                if (resData != null) {
                        for(let currentId in resData.savedEvents) {
                            for (let i = 0; i < events.length; i++) {
                                if (events[i].id === currentId) {
                                    filtered.push(events[i])
                                }
                            }
                        }

                    }
                return filtered;
            }));


        /*return this.http.get<UserProfile>(`https://app-mobilno.firebaseio.com/profile/${userId}.json`)
            .pipe(map((resData) => {
                let filtered: EventModel[] = [];
                if (resData != null) {

                    filtered = events.filter(function(e) {
                            return resData.savedEvents.includes(e);
                        });

                }
                console.log("Filtered: " + filtered);
                return filtered;
            }));*/
    }

    updateSavedEvents(savedEvents: any){
        this.authService.userId.subscribe(uid => {
            if (uid !== null) {
                this.getProfile(uid).subscribe((profile) =>{
                    profile.savedEvents = savedEvents;
                    this.afDatabase.object(`profile/${uid}`).update(profile);
                })
            }})

    }

    removeFromSaved(eventId: string){
      console.log("remove function");
        this.authService.userId.subscribe(userId => {
            if (userId !== null) {
                this.getSavedEventsIdsForCurrentUser(userId).subscribe((savedEvents) => {
                    console.log(eventId);
                    delete savedEvents[eventId];
                    this.updateSavedEvents(savedEvents);
                    console.log(savedEvents);
                });
            }
        })
    }

    addToSaved(eventId: string){
        console.log("add function");
        this.authService.userId.subscribe(userId => {
            if (userId !== null) {
                this.getSavedEventsIdsForCurrentUser(userId).subscribe((savedEvents) => {
                    console.log(eventId);
                    savedEvents[eventId] = true;
                    this.updateSavedEvents(savedEvents);
                    console.log(savedEvents);
                });
            }
        })
    }
}
