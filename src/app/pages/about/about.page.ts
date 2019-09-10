import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular'; /* SEJMM DS012; Registrar versión y dispositivo en pagina About */
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  /**SEJMM INI DS012; Registrar versión y dispositivo en pagina About */
  device: string;
  constructor(private platform: Platform) {}
  ngOnInit() {
    this.platform.ready().then(() => {

      if (this.platform.is('android')) {
          console.log('About: running on Android device!');
          this.device = 'Android';
      }
      if (this.platform.is('ios')) {
          console.log('About: running on iOS device!');
          this.device = 'iOS';
      }
   });
  }
  /**SEJMM FIN DS012 **/
}
