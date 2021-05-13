import { Injectable } from '@angular/core';
import {EventModel} from "./event.model";
import {HttpClient} from "@angular/common/http";
import {map, switchMap, take, tap} from "rxjs/operators";
import {BehaviorSubject} from "rxjs";
import {AuthService} from "../auth/auth.service";

interface EventData {
  name: string;
  startingDate: number;
  endingDate: number;
  location: string;
  description: string;
  imageUrl: string;
  category: string;
  moreDetails: string;
  valid: boolean;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private _userEvents = new BehaviorSubject<EventModel[]>([]);
  private _allEvents = new BehaviorSubject<EventModel[]>([]);

  last = '';

  constructor(private http: HttpClient,
              private authService: AuthService) {
      console.log("events service");
  }

  get userEvents(){
    return this._userEvents.asObservable();
  }

  get allEvents(){
        return this._allEvents.asObservable();
  }

  addEvent(name: string, startingDate: Date, endingDate: Date, location: string,
  description: string, imageUrl: string, category: string, moreDetails: string){
    let generatedId;
    let newEvent: EventModel;

    return this.authService.userId.pipe(
        take(1),
        switchMap((userId) => {
            newEvent = new EventModel(null, name, startingDate, endingDate, location,
                description, imageUrl, category, moreDetails, true, userId);

            return this.http.post<{id: string}>(`https://app-mobilno.firebaseio.com/user-events.json`,
                newEvent)
        }),
        switchMap( (resData) => {
            generatedId = resData.id;
            return this.userEvents;
        }),
        take(1),
        tap( (events) => {
            newEvent.id = generatedId;
            this._userEvents.next(events.concat(newEvent));
        })

    );

  }

  // get all events - scraped events + all user events
  getEvents(){
      let dbSource = this.getDbSource();
      let role = this.authService.role;

    return this.http.get<{[key: string]: EventData}>(`https://app-mobilno.firebaseio.com/${dbSource}.json`)
        .pipe(map((eventsData) => {
          console.log(eventsData);
          let events: EventModel[] = [];
          for(const key in eventsData){
            if(eventsData.hasOwnProperty(key)){
                if(eventsData[key].valid && role !== 'admin'){
                    var timestamp_start = eventsData[key].startingDate;
                    var timestamp_end = eventsData[key].endingDate;
                    //var timestamp_num: number = +timestamp;
                    events.push(new EventModel(
                        key,
                        eventsData[key].name,
                        new Date(timestamp_start * 1000),
                        new Date(timestamp_end * 1000),
                        eventsData[key].location,
                        eventsData[key].description,
                        eventsData[key].imageUrl,
                        eventsData[key].category,
                        eventsData[key].moreDetails,
                        eventsData[key].valid,
                        eventsData[key].userId
                        )
                    )
                }

                if(!eventsData[key].valid && role === 'admin'){
                    var timestamp_start = eventsData[key].startingDate;
                    var timestamp_end = eventsData[key].endingDate;
                    //var timestamp_num: number = +timestamp;
                    events.push(new EventModel(
                        key,
                        eventsData[key].name,
                        new Date(timestamp_start * 1000),
                        new Date(timestamp_end * 1000),
                        eventsData[key].location,
                        eventsData[key].description,
                        eventsData[key].imageUrl,
                        eventsData[key].category,
                        eventsData[key].moreDetails,
                        eventsData[key].valid,
                        eventsData[key].userId
                        )
                    )
                }

            }
          }

          events = events.sort(function(a, b){

              return a.startingDate.getTime() - b.startingDate.getTime();
          }).reverse();

          return events;
        }), tap( events => {
              this._allEvents.next(events);
            })
        );


  }



  // get events for current user
  getUserEvents(userId: string){
        return this.http.get<{[key: string]: EventData}>(`https://app-mobilno.firebaseio.com/user-events.json`)
            .pipe(map((eventsData) => {
                    //console.log(eventsData);
                    let events: EventModel[] = [];
                    for(const key in eventsData){
                        if(eventsData.hasOwnProperty(key)){
                            if(eventsData[key].userId === userId){
                                var timestamp_start = eventsData[key].startingDate;
                                var timestamp_end = eventsData[key].endingDate;
                                /*var timestamp_num: number = +timestamp;*/
                                events.push(new EventModel(
                                    key,
                                    eventsData[key].name,
                                    new Date(timestamp_start * 1000),
                                    new Date(timestamp_end * 1000),
                                    eventsData[key].location,
                                    eventsData[key].description,
                                    eventsData[key].imageUrl,
                                    eventsData[key].category,
                                    eventsData[key].moreDetails,
                                    eventsData[key].valid,
                                    eventsData[key].userId
                                    )
                                )
                            }

                        }
                    }

                    events = events.sort(function(a, b){

                        return a.startingDate.getTime() - b.startingDate.getTime();
                    }).reverse();

                    return events;
                }), tap( events => {
                    this._userEvents.next(events);
                })
            );

    }

    getDbSource(){
        let dbSource = ""
        if(window.location.pathname.startsWith('/my-events')){
            dbSource = "user-events";
        }
        if(window.location.pathname.startsWith('/events')){
            // change this to events-new
            dbSource = "events-new";
        }
        return dbSource;
    }

  getEvent(id: string){
      let dbSource = this.getDbSource();

    return this.http.get<EventData>(`https://app-mobilno.firebaseio.com/${dbSource}/${id}.json`)
        .pipe(map((resData) => {
          console.log(resData);
            var timestamp_start = resData.startingDate;
            var timestamp_end = resData.endingDate;
            /*var timestamp = resData.startingDate;
            var timestamp_num: number = +timestamp;*/
          return new EventModel(
              id,
              resData.name,
              new Date(timestamp_start * 1000),
              new Date(timestamp_end * 1000),
              resData.location,
              resData.description,
              resData.imageUrl,
              resData.category,
              resData.moreDetails,
              resData.valid,
              resData.userId
          );
        }));
  }

  deleteEvent(id: string){
      let dbSource = this.getDbSource();

    return this.http.delete(`https://app-mobilno.firebaseio.com/${dbSource}/${id}.json`)
        .pipe(switchMap(() => {
          return this.allEvents;
        }), take(1),
            tap((events) => {
              this._allEvents.next(events.filter((e) => e.id !== id));
            })
        );
  }
  

  editEvent(id: string, name: string, startingDate: Date, endingDate: Date, location: string,
           description: string, imageUrl: string, category: string, moreDetails: string, valid: boolean,
            userId: string){

      let dbSource = this.getDbSource();

    return this.http.put(`https://app-mobilno.firebaseio.com/${dbSource}/${id}.json`,
        {name, startingDate, endingDate, location, description, imageUrl, category, moreDetails,
          valid, userId})
        .pipe(switchMap(() => this.allEvents),
            take(1),
            tap((events) => {
              const updatedEventIndex = events.findIndex((e) => e.id === id);
              const updatedEvents = [...events];
              updatedEvents[updatedEventIndex] = new EventModel(id, name, startingDate, endingDate, location,
                  description, imageUrl, category, moreDetails, valid, userId)

              this._allEvents.next(updatedEvents);
            })
        );
  }

}
