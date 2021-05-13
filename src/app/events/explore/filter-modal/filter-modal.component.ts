import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Profiler} from "inspector";
import {ProfileService} from "../../../user-profile/profile.service";
import {AuthService} from "../../../auth/auth.service";

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {

  /*public theatersSelected = true;
  public festivalsSelected = true;
  public concertsSelected = true;
  public sportsSelected = true;*/

    public theatersSelected: boolean;
    public festivalsSelected: boolean;
    public concertsSelected: boolean;
    public sportsSelected: boolean;

  constructor(private modalCtrl: ModalController,
              private profileService: ProfileService,
              private authService: AuthService,
             ) { }

  ngOnInit() {

  }
    ionViewWillEnter(){
        /*this.authService.userId.subscribe(userId => {
            if (userId !== null) {
                this.profileService.getProfile(userId).subscribe((profile) => {
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
                })
            } else{
                this.theatersSelected = true;
                this.festivalsSelected = true;
                this.concertsSelected = true;
                this.sportsSelected = true;
            }
        })*/
    }

  closeModal(){
    /*let filterState = {
      theatersSelected: this.theatersSelected,
      festivalsSelected: this.festivalsSelected,
      concertsSelected: this.concertsSelected,
      sportsSelected: this.sportsSelected,
    }*/

    this.modalCtrl.dismiss({filterState: {
        theatersSelected: this.theatersSelected,
        festivalsSelected: this.festivalsSelected,
        concertsSelected: this.concertsSelected,
        sportsSelected: this.sportsSelected,
      }}, 'confirmed');
  }

}
