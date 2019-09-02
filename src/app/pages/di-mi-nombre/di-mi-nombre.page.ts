/**
 * Descripción: Componente que implementa toda la lógica asociada a los elementos HTML en di-mi-nombre.page.html
 * First version: SEJMM DS003 01/09/2019; Desarrollo 'Di Mi Nombre'; Primera Fase; Lógica base.
 * */
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService, Elem } from './../../services/database.service'; // Importamos clases DB
import { PopoverController } from '@ionic/angular'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { NotificationsComponent } from './../../components/notifications/notifications.component'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { ActivatedRoute } from '@angular/router';
import { skip, take } from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción

@Component({
  selector: 'app-di-mi-nombre',
  templateUrl: './di-mi-nombre.page.html',
  styleUrls: ['./di-mi-nombre.page.scss'],
})
export class DiMiNombrePage implements OnInit {
  /** Atributos de clase **/
  @ViewChild('wordSlider') wordSlider;
  tableArrayElements: Elem[] = []; // DS007: Preparación multitabla
  argumentos = null; // DS007: Preparación multitabla

  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    public popoverCtrl: PopoverController, // DS006: Implementación de ion-popover para mostrar el final del juego
    private activeRoute: ActivatedRoute // DS007: Preparación multitabla
  ) { }

  ngOnInit() {
    this.argumentos = this.activeRoute.snapshot.paramMap.get('tableName'); // Obtenemos la tabla enviada desde select-table. DS007: Preparación multitabla
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadTableForGame(this.argumentos, 5);
        // A continuación nos suscribiremos al observable que almacena el resultado de SELECT * FROM TABLE desuscribiendonos inmediatamente despues con la pipe(take(1))
        this.db.getSelectedTableForGame()
        .pipe(skip(1), take(1))
        .subscribe(table => { // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
          this.tableArrayElements = table;
        });
      }
    });
  }

  lockSwipes() {
    this.wordSlider.lockSwipes();
  }

  next() {
    this.wordSlider.slideNext();
  }

  /**
   * SEJMM 28/07/2019 DS006: Implementación de ion-popover para mostrar el final del juego
   */
  async notifications() {
    const popover = await this.popoverCtrl.create({
        component: NotificationsComponent,
        event: null,
        animated: true,
        showBackdrop: true, // Muestra fondo translucido de la page que invocó tras el popover
        backdropDismiss: false // Evita que el popover desaparezca al pulsar sobre el backdrop
    });
    return await popover.present();
  }
}
