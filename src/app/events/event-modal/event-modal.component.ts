import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {NgForm} from "@angular/forms";
import {EventModel} from "../event.model";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss'],
})
export class EventModalComponent implements OnInit {
  @ViewChild('f', {static: true}) form: NgForm;
  @Input() title: string;
  @Input() name: string;
  @Input() startingDate: Date;
  @Input() endingDate: Date;
  @Input() location: string;
  @Input() description: string;
  @Input() imageUrl: string;
  @Input() category: string;
  @Input() moreDetails: string;
  @Input() valid: boolean;

    role: string;

  constructor(private modalCtrl: ModalController,
              private authService: AuthService,
              private alertCtrl: AlertController) { }

  ngOnInit() {
      /*if(this.role === 'user'){
          this.valid = true;
      }*/


      if(this.startingDate === undefined){
          this.startingDate = new Date();
      }

      if(this.endingDate === undefined){
          this.endingDate = new Date();
      }
  }

    ionViewWillEnter(){

        this.role = this.authService.role;
        console.log("Event modal: " + this.role);

    }

  onCancel(){
    this.modalCtrl.dismiss();
  }

  onAddEvent(){
    if(!this.form.valid){
      return;
    }

    var startingDateFormatted = new Date(this.form.value['startingDate']);
    var startingDateTimestamp = startingDateFormatted.getTime()/1000;

    var endingDateFormatted = new Date(this.form.value['endingDate']);
    var endingDateTimestamp = endingDateFormatted.getTime()/1000;

    this.modalCtrl.dismiss({eventData: {
        name: this.form.value['name'],
        startingDate: startingDateTimestamp.toFixed(2),
        endingDate: endingDateTimestamp.toFixed(2),
        location: this.form.value['location'],
        description: this.form.value['description'],
        imageUrl: this.form.value['imageUrl'],
        category: this.form.value['category'],
        moreDetails: this.form.value['moreDetails'],
        valid: this.form.value['valid']
      }}, 'confirm');

      this.alertCtrl.create({
          header: 'Success',
          message: 'Event added!',
          buttons: ['Okay']
      }).then((alert) => {
          alert.present();
      });
  }

}
