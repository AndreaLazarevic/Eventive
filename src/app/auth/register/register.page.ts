import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/auth';
import {Task} from "protractor/built/taskScheduler";
import {AlertController} from "@ionic/angular";
import {ProfileService} from "../../user-profile/profile.service";
import {UserProfile} from "../../user-profile/user-profile.model";


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  profile = {} as UserProfile;
  Checkboxes: any;

  constructor(private authService: AuthService,
              private router: Router,
              private afAuth: AngularFireAuth,
              private alertCtrl: AlertController,
              private profileService: ProfileService) {

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
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(''),
      surname: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(7)])
    });
  }

  async onRegister() {
    console.log(this.registerForm);

    let email = this.registerForm.get('email').value;

    const methods = await this.afAuth.fetchSignInMethodsForEmail(email);

    if(methods.length > 0){
      console.log("Account with this email address already exists.");
      this.alertCtrl.create({
        header: 'Error!',
        message: 'Account with this email address already exists.',
        buttons: ['Okay']
      }).then((alert) => {
        alert.present();
      });
      this.registerForm.reset();
    }else{
      this.authService.register(this.registerForm.value).subscribe(resData => {
        console.log('Registered successfully!');
        console.log(resData);
      })

      this.profileService.createProfile(this.profile, this.Checkboxes);

      this.router.navigateByUrl('/user-profile', {replaceUrl: true});
    }



    /*this.authService.register(this.registerForm.value).subscribe(resData => {
        console.log('Registracija uspesna');
        console.log(resData);
      })

      this.router.navigateByUrl('/user-profile');*/
  }
}
