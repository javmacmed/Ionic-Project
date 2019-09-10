import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';
import { timer } from 'rxjs/observable/timer'; // SEJMM DS004 SplashScreen + animation

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appPages: Array<Pages>;

  showSplash = true; // SEJMM DS004 SplashScreen + animation

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController
  ) {
    this.appPages = [
      {
        title: 'Home',
        url: '/home-results',
        direct: 'root',
        icon: 'home'
      },
      {
        title: 'Sobre Say My Name',
        url: '/about',
        direct: 'forward',
        icon: 'information-circle-outline'
      }
      // ,
      // {
      //   title: 'App Settings',
      //   url: '/settings',
      //   direct: 'forward',
      //   icon: 'cog'
      // }
    ];

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // SEJMM INI DS004; SplashScreen + Animation
      // Timer para controlar la visibilidad de la animación
      timer(3000).subscribe(() => this.showSplash = false);
    }).catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    this.navCtrl.navigateRoot('/');
  }
}
