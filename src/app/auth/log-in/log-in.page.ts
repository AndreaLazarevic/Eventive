import { Component, OnInit } from '@angular/core';
import {AuthResponseData, AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AlertController} from "@ionic/angular";
import {ProfileService} from "../../user-profile/profile.service";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  isLoggingIn = false;

  constructor(private authService: AuthService,
              private router: Router,
              private alertCtrl: AlertController,
              private profileService: ProfileService) { }

  ngOnInit() {
  }

  onLogIn(form: NgForm){
    console.log(form)

    if(form.valid){
      this.authService.logIn(form.value).subscribe(
          (resData: AuthResponseData) => {
            this.isLoggingIn = true;
            console.log('Prijava uspesna');
            console.log(resData);
            this.setRole().subscribe(uid => {
              if (uid !== null) {

                this.profileService.getRole(uid).subscribe((value) => {
                  if (value != "guest") {
                    this.authService.role = value;
                    this.router.navigateByUrl('/events');
                    this.isLoggingIn = false;
                    console.log("Set " + value);
                  }

                });
              }
            });

          },
          errRes => {
            console.log(errRes);
            let message = 'Incorrect email or password!';

            this.alertCtrl.create({
              header: 'Authentication failed',
              message: message,
              buttons: ['Okay']
            }).then((alert) => {
              alert.present();
            });
            this.isLoggingIn = false;
            form.reset();
          });


    }
  }

  setRole(){
    return this.authService.userId /*.subscribe(uid => {
      if (uid !== null) {

        this.profileService.getRole(uid).subscribe((value) => {
          if(value!="guest"){
            this.authService.role = value;
            console.log("Set " + value);
          }

        });
      }
    })*/
  }
}
