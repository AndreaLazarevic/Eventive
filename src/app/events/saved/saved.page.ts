import {Component, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from "ionic2-calendar";
import {EventModel} from "../event.model";
import {EventsService} from "../events.service";
import {Router} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {ProfileService} from "../../user-profile/profile.service";

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {
  eventSource = [];
  viewTitle: string;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  }

  //selectedDate: Date;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(private eventsService: EventsService,
              private authService: AuthService,
              private profileService: ProfileService,
              private router: Router) { }

  ngOnInit() {
    /*this.eventsService.events.subscribe((events: EventModel[]) => {

      this.eventSource = events;
      this.transformList(this.eventSource);
    })*/

    /*this.authService.userId.subscribe(userId => {
      if (userId !== null) {
        this.profileService.getSavedEventsForCalendar(userId).subscribe((savedEvents) => {
          this.eventSource = savedEvents;
          this.transformList(this.eventSource);
        });
      }
    })*/

  }

  ionViewWillEnter(){
    this.authService.userId.subscribe(userId => {
      if (userId !== null) {
        this.profileService.getSavedEventsForCalendar(userId).subscribe((savedEvents) => {
          this.eventSource = savedEvents;
          this.transformList(this.eventSource);
        });
      }
    })

  }

  nextMonth() {
    this.myCal.slideNext();
  }

  prevMonth() {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }

  transformList(events){
    for (var _i = 0; _i < this.eventSource.length; _i++) {
      this.eventSource[_i].startTime = new Date(this.eventSource[_i].startingDate);
      this.eventSource[_i].endTime = new Date(this.eventSource[_i].endingDate);
      this.eventSource[_i].allDay = true;
      this.eventSource[_i].title = this.eventSource[_i].name;
      //console.log(this.eventSource[_i].id);

    }
  }

  onEventSelected(event) {
    console.log("TEST " + event.id);
    this.router.navigateByUrl('/events/tabs/explore/' + event.id);
  }

}
