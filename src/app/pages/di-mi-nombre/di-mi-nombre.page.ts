/**
 * Descripción: Componente que implementa toda la lógica asociada a los elementos HTML en di-mi-nombre.page.html
 * First version: SEJMM DS003 01/09/2019; Desarrollo 'Di Mi Nombre'; Primera Fase; Lógica base.
 * */
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DatabaseService, Elem, ResElem } from './../../services/database.service'; // Importamos clases DB
import { Subject, BehaviorSubject } from 'rxjs';
import { PopoverController, ToastController } from '@ionic/angular'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { NotificationsComponent } from './../../components/notifications/notifications.component'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
import { AlterOrderPipe } from './../../pipes/alter.order.pipe';
import { SpellPipe } from './../../pipes/spell.pipe';
import * as _ from 'lodash';

@Component({
  selector: 'app-di-mi-nombre',
  templateUrl: './di-mi-nombre.page.html',
  styleUrls: ['./di-mi-nombre.page.scss'],
  providers: [AlterOrderPipe, SpellPipe]
})
export class DiMiNombrePage implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  /** Atributos de clase **/
  @ViewChild('slides') slides;
  tableArrayElements: Elem[] = []; // DS007: Preparación multitabla
  tableArrayResElements: ResElem[] = []; // DS011: Tabla de resultados obtenida desde DB para sumar resultados de esta ronda
  tablesArrayName: string[] = []; // DS011; Todas las tablas para buscar entre ellas la tabla concerniente a esta version de Di mi nombre
  randomizedTableArrayElements: Elem[] = []; // DS007: Preparación multitabla
  argumentos = null; // DS007: Preparación multitabla
  activeIndex: number;
  /* Los siguientes atributos volverán a su valor por defecto al cambiar de slide (this.nextSlide) */
  letterCounter: number; // Contador de letras introducidas en el resultado del slide activo.
  elemViewedInCurrentSlide: Elem; // Elemento observado en el slide activo.
  correctLettersArray: string[] | boolean; // Array con las letras de la palabra englishName del elemViewedInCurrentSlide.
  inputLettersArray: string[] | boolean; // Array con las letras introducidas del slide activo.
  slideIndex = 0;
  numOfSlides = 0; // Numero de slides en el template
  /* Para los resultados */
  correctAnswers = 0;
  incorrectAnswers = 0;

  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    public popoverCtrl: PopoverController, // DS006: Implementación de ion-popover para mostrar el final del juego
    public toastCtrl: ToastController,
    private activeRoute: ActivatedRoute, // DS007: Preparación multitabla
    private alterOrder: AlterOrderPipe,
    private spell: SpellPipe
  ) { }

  ngOnInit() {
    this.argumentos = this.activeRoute.snapshot.paramMap.get('tableName'); // Obtenemos la tabla enviada desde select-table. DS007: Preparación multitabla
    this.letterCounter = 0;
    this.lockSwipes(true);

    this.db.getDatabaseState().pipe(takeUntil(this.unsubscribe$)).subscribe(rdy => {
      if (rdy) {
        /* Cargamos tabla de elementos para mostrar en los slides */
        this.db.loadTableForGame(this.argumentos, 5);
        /* Cargamos tablas para obtener al finalizar el juego la tabla resultados que corresponde en caso de existir (DS011)*/
        const resultTableName = 'res_' + this.argumentos + '_diminombre';
        this.db.loadTablesForResults();
        this.db.getTablesForResults()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(tableResult => {
            this.tablesArrayName = tableResult;
            /* Cargamos tabla de elementos para mostrar en los slides */
            if (this.tablesArrayName.includes(resultTableName)) {
              this.db.loadTableForResults(resultTableName);
            }
          });
      }
    });
    this.db.getTableState().pipe(takeUntil(this.unsubscribe$)).subscribe(tableRdy => {
      if (tableRdy) {
        // A continuación nos suscribiremos al observable que almacena el resultado de SELECT * FROM TABLE desuscribiendonos inmediatamente despues con la pipe(take(1))
        this.db.getSelectedTableForGame()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(table => { // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
            this.tableArrayElements = table;
            this.randomizedTableArrayElements = this.alterOrder.transform(this.tableArrayElements, []); // Ordenamos array aleatoriamente con pipe alterOrder desde el .ts
            this.numOfSlides = this.randomizedTableArrayElements.length; // Almacenamos el número de slides en la template
            this.elemViewedInCurrentSlide = this.randomizedTableArrayElements[this.slideIndex]; // Primer elemento del array ordenado aleatoriamente
            this.inputLettersArray = [];
            for (let i = 0; i < this.elemViewedInCurrentSlide.englishName.length; i++) {
              this.inputLettersArray[i] = ' ';
            }
            this.correctLettersArray = this.spell.transform(this.elemViewedInCurrentSlide.englishName.toUpperCase(), []);
          });
      }
    });
  }
  ngOnDestroy() {
    console.log('Di Mi nombre: ngOnDestory');
    this.db.tableReady = new BehaviorSubject(false);
    this.db.tableForResultsReady = new BehaviorSubject(false);
    this.db.selectedTableForGame = new BehaviorSubject<Elem[]>([]);
    this.db.tablesArrayNameForResults = new BehaviorSubject<string[]>([]);
    this.db.selectedTableForResults = new BehaviorSubject<ResElem[]>([]);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description Obtiene el indice del slide actual
   */
  getSlideIndex() {
    this.slides.getActiveIndex().then(index => {
      console.log('Slide: ', index);
      this.slideIndex = index;
    });
  }

  /**
  * @description Devuelve true si el slide actual es el último
  */
  isEndSlide(): boolean {
    const a = this.slides.isEnd().then(ret => {
      console.log('IsEnd: ', ret);
      return ret;
    });
    return a;
  }

  /**
   * @description Bloquea o desbloquea en función de un boolean.
   * @param lock Si True, bloquea el movimiento entre slides en todas direcciones, si False lo desbloquea
   */
  lockSwipes(lock: boolean) {
    this.slides.lockSwipes(lock);
  }

  /**
   * @description Nos desplaza hacia el próximo slide creado reinicializando todas las variables de estado a su valor por defecto
   */
  nextSlide() {
    this.slides.slideNext();
    this.letterCounter = 0;
    // this.getSlideIndex();
    this.slideIndex++;
    this.elemViewedInCurrentSlide = this.randomizedTableArrayElements[this.slideIndex];
    this.correctLettersArray = this.spell.transform(this.elemViewedInCurrentSlide.englishName.toUpperCase(), []);
    this.inputLettersArray = []; // Reinicializamos el array de letras introducidas para evitar caracteres de más
    for (let i = 0; i < this.elemViewedInCurrentSlide.englishName.length; i++) {
      this.inputLettersArray[i] = ' ';
    }
  }

  /**
  * @description Se encarga de añadir letras a la palabra resultado en caso de que aún queden huecos disponibles
  * y aumenta a su vez el contador de éstas.
  * */
  gameLogic(letter: string) {
    if (this.letterCounter < this.elemViewedInCurrentSlide.englishName.length) {
      this.inputLettersArray[this.letterCounter] = letter;
      this.letterCounter++;
    } else {
      console.log('No se añadirán más letras, tamaño de palabra alcanzado');
    }
  }

  /**
  * @description Elimina una letra de la palabra resultado disminuyendo a su vez el contador de estas.
  * */
  deleteLetter() {
    if (this.letterCounter > 0) {
      this.letterCounter--;
      this.inputLettersArray[this.letterCounter] = ' ';
    } else if (this.letterCounter === 0) {
      console.log('No hay más letras que borrar');
    }
  }

  /**
   * @description Se lanza al pulsar el boton con la 'Checkmark', comprueba si la palabra resultado ha sido rellenada completamente y si es correcta. En caso de serlo, llama a la función
   * encargada de pasar al siguiente slide, y en caso de ser el último slide, nos muestra un pop-over indicandonos que hemos completado el juego.
   */
  isSlideFinished() {
    if (this.letterCounter === this.elemViewedInCurrentSlide.englishName.length) {
      /*** SEJMM INI RESULTADOS ***/
      if (this.isEndSlide() === true || this.slideIndex === this.numOfSlides - 1) {
        if (_.isEqual(this.inputLettersArray, this.correctLettersArray)) {
          this.correctAnswers++;
        } else {
          this.incorrectAnswers++;
        }

        /* Creamos tabla de resultados correspondiente con resultado del juego obtenido o, de ya existir, sumaremos los errores y aciertos a la suma total almacenada esta tabla y este juego */
        const resultTableName = 'res_' + this.argumentos + '_diminombre';
        if (this.tablesArrayName.includes(resultTableName)) {
          // Si la tabla ya existe
          this.db.getTableForResultsState().pipe(takeUntil(this.unsubscribe$)).subscribe(resRdy => {
            if (resRdy) {
              // Si la tabla ya existe
              this.db.getSelectedTableForResults()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(tableResult => {
                  this.tableArrayResElements = tableResult;
                  const auxResElem = {
                    id: this.tableArrayResElements[0].id,
                    aciertos: this.tableArrayResElements[0].aciertos +  this.correctAnswers,
                    errores: this.tableArrayResElements[0].errores + this.incorrectAnswers
                  };
                  this.db.updateTableElementForResults(auxResElem, resultTableName);
                });
            }
          });
        } else {
          // Si la tabla nunca ha sido creada
          this.db.createTableForResults(resultTableName); // Creamos tabla
          this.db.addTableElementForResults(resultTableName, this.correctAnswers, this.incorrectAnswers); // Añadimos elementos
        }
      /*** SEJMM FIN RESULTADOS ***/

        /* Mostramos fin del juego */
        (async () => {
          await this.delay(1000);
          // alert('HAS GANADO!!');
          this.notifications(); // DS006: Implementación de ion-popover para mostrar el final del juego
        })();
      } else {
        if (_.isEqual(this.inputLettersArray, this.correctLettersArray)) {
          this.correctAnswers++;
        } else {
          this.incorrectAnswers++;
        }
        // this.lockSwipes(false);
        this.nextSlide();
        // this.lockSwipes(true);

      }
    } else {
     this.presentToast();
    }
  }

  /**
   * @description Nos sirve para determinar cual de los div sobre los que se iran colocando las letras es el activo
   * @param divIndex Index basado en numero de letras escritas en array de letras escritas al pulsar los botones con las letras desordenadas en ingles
   */
  isActiveDiv(divIndex: number): number {
    if (divIndex === this.letterCounter) {
      return 1;
    } else {
      return 0;
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

  /**
   * @description Presenta un toast.
   * SEJMM 19/09/2019;
   */
  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Debe rellenar los huecos antes de confirmar',
      duration: 2000
    });
    toast.present();
  }
}
