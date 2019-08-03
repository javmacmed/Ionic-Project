import { Component, OnInit} from '@angular/core';
// import { UnePalabrasPage } from './../../pages/une-palabras/une-palabras.page';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  // @ViewChild(UnePalabrasPage) hijo: UnePalabrasPage; En caso de que deseasemos trabajar con alguna variable

  constructor(public popoverCtrl: PopoverController) { } // DS006: Implementación de ion-popover para mostrar el final del juego

  ngOnInit() {
    // this.popoverCtrl = this.hijo.popoverCtrl;
  }

  /**
   * SEJMM DS006: Implementación de ion-popover para mostrar el final del juego
   */
  async comeBack () {
    return await this.popoverCtrl.dismiss();
  }
}
