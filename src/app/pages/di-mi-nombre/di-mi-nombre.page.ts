/**
 * Descripción: Componente que implementa toda la lógica asociada a los elementos HTML en di-mi-nombre.page.html
 * First version: SEJMM DS003 01/09/2019; Desarrollo 'Di Mi Nombre'; Primera Fase; Lógica base.
 * */
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService, Elem } from './../../services/database.service'; // Importamos clases DB
import { PopoverController } from '@ionic/angular'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { NotificationsComponent } from './../../components/notifications/notifications.component'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
import { AlterOrderPipe } from './../../pipes/alter.order.pipe';
import { SpellPipe } from './../../pipes/spell.pipe';
import * as _ from 'lodash';

@Component({
  selector: 'app-di-mi-nombre',
  templateUrl: './di-mi-nombre.page.html',
  styleUrls: ['./di-mi-nombre.page.scss'],
  providers: [AlterOrderPipe, SpellPipe]
})
export class DiMiNombrePage implements OnInit {
  /** Atributos de clase **/
  @ViewChild('slides') slides;
  tableArrayElements: Elem[] = []; // DS007: Preparación multitabla
  randomizedTableArrayElements: Elem[] = []; // DS007: Preparación multitabla
  argumentos = null; // DS007: Preparación multitabla
  activeIndex: number;
  /* Los siguientes atributos volverán a su valor por defecto al cambiar de slide (this.nextSlide) */
  letterCounter: number; // Contador de letras introducidas en el resultado del slide activo.
  elemViewedInCurrentSlide: Elem; // Elemento observado en el slide activo.
  correctLettersArray: string[] | boolean; // Array con las letras de la palabra englishName del elemViewedInCurrentSlide.
  inputLettersArray: string[] | boolean; // Array con las letras introducidas del slide activo.
  slideIndex = 0;
  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    public popoverCtrl: PopoverController, // DS006: Implementación de ion-popover para mostrar el final del juego
    private activeRoute: ActivatedRoute, // DS007: Preparación multitabla
    private alterOrder: AlterOrderPipe,
    private spell: SpellPipe
  ) { }

  ngOnInit() {
    this.argumentos = this.activeRoute.snapshot.paramMap.get('tableName'); // Obtenemos la tabla enviada desde select-table. DS007: Preparación multitabla
    this.inputLettersArray = [];
    this.letterCounter = 0;
    this.lockSwipes(true);

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadTableForGame(this.argumentos, 5);
      }
    });
    this.db.getTableState().subscribe(tableRdy => {
      if (tableRdy) {
        // A continuación nos suscribiremos al observable que almacena el resultado de SELECT * FROM TABLE desuscribiendonos inmediatamente despues con la pipe(take(1))
        this.db.getSelectedTableForGame()
          .pipe(take(1))
          .subscribe(table => { // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
            this.tableArrayElements = table;
            this.randomizedTableArrayElements = this.alterOrder.transform(this.tableArrayElements, []); // Ordenamos array aleatoriamente con pipe alterOrder desde el .ts
            this.elemViewedInCurrentSlide = this.randomizedTableArrayElements[this.slideIndex]; // Primer elemento del array ordenado aleatoriamente
            for (let i = 0; i < this.elemViewedInCurrentSlide.englishName.length; i++) {
              this.inputLettersArray[i] = ' ';
            }
            this.correctLettersArray = this.spell.transform(this.elemViewedInCurrentSlide.englishName, []);
          });
      }
    });
  }

  getSlideIndex() {
    this.slides.getActiveIndex().then(index => {
      console.log('Slide: ', index);
      this.slideIndex = index;
    });
  }

  isEndSlide(): boolean {
    let isEnd;
    this.slides.isEnd().then(ret => {
      console.log('IsEnd: ', ret);
      isEnd = ret;
    });
    return isEnd;
  }

  lockSwipes(lock: boolean) {
    this.slides.lockSwipes(lock);
  }

  nextSlide() {
    this.slides.slideNext().then(_ => {
      this.getSlideIndex();
    });
    this.letterCounter = 0;
    // this.getSlideIndex();
    this.elemViewedInCurrentSlide = this.randomizedTableArrayElements[this.slideIndex];
    this.correctLettersArray = this.spell.transform(this.elemViewedInCurrentSlide.englishName, []);
    for (let i = 0; i < this.elemViewedInCurrentSlide.englishName.length; i++) {
      this.inputLettersArray[i] = ' ';
    }
  }

  gameLogic(letter: string) {
    if (this.letterCounter < this.elemViewedInCurrentSlide.englishName.length) {
      this.inputLettersArray[this.letterCounter] = letter;
      this.letterCounter++;
    } else {
      console.log('No se añadirán más letras, tamaño de palabra alcanzado');
    }
  }

  deleteLetter() {
    if (this.letterCounter > 0) {
      this.letterCounter--;
      this.inputLettersArray[this.letterCounter] = ' ';
    } else if (this.letterCounter === 0) {
      console.log('No hay más letras que borrar');
    }
  }

  isSlideFinished() {
    if (this.letterCounter === this.elemViewedInCurrentSlide.englishName.length &&
      _.isEqual(this.inputLettersArray, this.correctLettersArray)) {
      if (this.isEndSlide() === true) {
        (async () => {
          await this.delay(1000);
          // alert('HAS GANADO!!');
          this.notifications(); // DS006: Implementación de ion-popover para mostrar el final del juego
        })();
      } else {
        this.lockSwipes(false);
        this.nextSlide();
        this.lockSwipes(true);

      }
    }
  }

  /**
 * Crea un delay/sleep/Timer o callback en la aplicación. Usado con la función async/await permitiremos que dicho callback sea asincrono al resto de la app.
 * SEJMM DS003.1; Implementación de Timer asincrono para devolver el estado por defecto a las duplas incorrectas pasado un tiempo determinado.
 * @param ms: Tiempo usado en el timer.
 */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
