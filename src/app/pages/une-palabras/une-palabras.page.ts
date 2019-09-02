/**
 * Descripción: Componente que implementa toda la lógica asociada a los elementos HTML en une-palabras.page.html
 * First version: SEJMM DS003 09/06/2019; Desarrollo 'Une Palabras'; Primera Fase; Lógica base.
 * Update 25/07/2019; SEJMM DS003.1: Implementación de Timer asincrono para devolver el estado por defecto a las duplas incorrectas pasado un tiempo determinado.
 * */

import { Component, OnInit } from '@angular/core';
import { DatabaseService, Elem } from './../../services/database.service'; // Importamos clases DB
import { Observable } from 'rxjs';
import { NotificationsComponent } from './../../components/notifications/notifications.component'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { PopoverController } from '@ionic/angular'; // DS006: Implementación de ion-popover para mostrar el final del juego
import { ActivatedRoute } from '@angular/router';
import { skip, take } from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción

@Component({
  selector: 'app-une-palabras',
  templateUrl: './une-palabras.page.html',
  styleUrls: ['./une-palabras.page.scss'],
})
export class UnePalabrasPage implements OnInit {
  /** Atributos de clase **/
  numWordsSelected = 0;
  lastElemColumnSelected = 2; // Última columna seleccionada; 0: izquierda, 1: derecha, 2: No determinada
  idOfWordSelected: number;
  tableArrayElements: Elem[] = []; // DS007: Preparación multitabla
  // stableArrayElementsLimited: Elem[] = []; // DS003.3.1: UPDATE REORDER CON LIMITE
  idResultsMap = new Map<number, Map<number, number>>(); // Mapa para almacenar las relaciones id-resultado del juego en función de las columnas
  numDuplasCorrectas = 0; // Numero de duplas correctas. Usadas para determinar una condición final de juego (Fácil)
  argumentos = null; // DS007: Preparación multitabla

  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    public popoverCtrl: PopoverController, // DS006: Implementación de ion-popover para mostrar el final del juego
    private activeRoute: ActivatedRoute // DS007: Preparación multitabla
    ) { }

  ngOnInit() {
    this.argumentos = this.activeRoute.snapshot.paramMap.get('tableName'); // Obtenemos la tabla enviada desde select-table. DS007: Preparación multitabla
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadTableForGame(this.argumentos, 10);
        // A continuación nos suscribiremos al observable que almacena el resultado de SELECT * FROM TABLE desuscribiendonos inmediatamente despues con la pipe(take(1))
        this.db.getSelectedTableForGame()
        .pipe(skip(1), take(1))
        .subscribe(table => { // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
          this.tableArrayElements = table;
          // Obtenemos array de elementos limitado
          // this.tableArrayElementsLimited = this.tableArrayElements.slice(0, 4 + 1); // Suma de 1 al final es debida a que el final del intervalo no esta incluido.

          /* Inicializamos el mapa id-valorMap<idColumna, valor> para cada entrada en la tabla de animales con la que se va a jugar. De este
            modo definiremos como valor por defecto 3 (Color por defecto, no elegido).
          */
          for (const elem of this.tableArrayElements) {
            const auxMap = new Map<number, number>();
            auxMap.set(0, 3); // Columna izquierda; Color default
            auxMap.set(1, 3); // Columna derecha; Color default
            this.idResultsMap.set(elem.id, auxMap);
          }
        });
      }
    });
  }

  /**
   * @description: Establece el resultado actual del par de valores para cada fila de la tabla seleccionada, almacenando este
   * como valor en el mapa 'idResultsMap' que consta de una mapa id-map(columna-valor) para identificar el color que deberia
   * tener cada boton de cada columna .
   * @param id: Id del elemento seleccionado por el usuario
   * @param column: Usado para evitar que confundamos el pulsar el mismo elemento dos veces en lugar del par correctamente
   * TODO: Establecer colores de los elementos con el ID entrante en la funcion en caso de no suceder un error
   */
  selectWords(id: number, column: number) {
    const auxMap = this.idResultsMap.get(id); // Declaramos mapa auxiliar y obtenemos el mapa asociado al id pasado como parametro
    const firstAuxMap = this.idResultsMap.get(this.idOfWordSelected);

    /* Antes de nada comprobaremos que el elemento pulsado no se trate de una dupla ya establecida como correcta (verde)*/
    if (auxMap.get(column) !== 1) {
      /* Ahora procederemos con la lógica ejecucional del juego */
      if (this.numWordsSelected === 0) {
        /** Primer botón de la combinación pulsado;
         *  Color amarillo.
         * **/
        auxMap.set(column, 2);
        this.numWordsSelected++;
        this.idOfWordSelected = id;
        this.lastElemColumnSelected = column; // Almacenamos la columna del primer elemento de la selección
      } else if (this.numWordsSelected === 1) {
        this.numWordsSelected = 0; // Reiniciamos el contador
        if (this.lastElemColumnSelected !== column && this.lastElemColumnSelected !== 2) { /* Si estan en columnas diferentes*/
          this.lastElemColumnSelected = 2; // Reiniciamos la columna anterior a por defecto (no determinada)
          /** Añadimos/modificamos par clave-valor **/
          if (this.idOfWordSelected === id) {
          /** Segundo botón de la combinación pulsado; Valor correcto;
          * Color verde.
          **/
            auxMap.set(column, 1);  // Correcto
            this.numDuplasCorrectas++; // Incrementamos numero de duplas correctas

            /**** SEJMM DS003.2;
             * Comprobar condición FINAL DE JUEGO (Fácil)
             * ****/
            if (this.numDuplasCorrectas === this.tableArrayElements.length) {
              (async () => {
                await this.delay(1000);
                // alert('HAS GANADO!!');
                this.notifications(); // DS006: Implementación de ion-popover para mostrar el final del juego
              })();
            }

            /* Ponemos el primer elemento con el color adecuado para una eleccion correcta */
            if (column - 1 === 0) {
              firstAuxMap.set(0, 1);
            } else {
              firstAuxMap.set(1, 1);
            }
          } else {
          /** Segundo botón de la combinación pulsado; Valor incorrecto;
          * Color rojo.
          * **/
            auxMap.set(column, 0);  // Incorrecto
            /* Usaremos función asíncrona para modificar el mapa de datos pasado un tiempo determinado;  SEJMM DS003.1*/
            (async () => {
              await this.delay(750);
              auxMap.set(column, 3); // Por defecto
            })();

            /* Ponemos el primer elemento con el color adecuado para una eleccion incorrecta */
            if (column - 1 === 0) {
              firstAuxMap.set(0, 0);
              /* Usaremos función asíncrona para modificar el mapa de datos pasado un tiempo determinado;  SEJMM DS003.1*/
              (async () => {
                await this.delay(750);
                firstAuxMap.set(0, 3); // Por defecto
              })();
            } else {
              firstAuxMap.set(1, 0);
              /* Usaremos función asíncrona para modificar el mapa de datos pasado un tiempo determinado;  SEJMM DS003.1*/
              (async () => {
                await this.delay(750);
                firstAuxMap.set(1, 3); // Por defecto
              })();
            }
          }
          /* Actualizamos el resultado en el mapa de mapas general */
          // No necesario, dado que al apuntar a este mapa los get que asociamos a los mapas auxiliares modificamos el mapa final.
          // He aquí la evidencia:
          // this.idResultsMap.set(this.idOfWordSelected, firstAuxMap);

        } else { /* Si el segundo elemento seleccionado esta en la misma columna que el primero */
          firstAuxMap.set(column, 3); // Devolvemos al primer elemento el color por defecto
          this.numWordsSelected = 0; // Reiniciamos el contador
          this.lastElemColumnSelected = 2; // Reiniciamos la columna anterior a por defecto (no determinada)
        }
      } else {
        this.numWordsSelected = 0; // Reiniciamos el contador
        this.lastElemColumnSelected = 2; // Reiniciamos la columna anterior a por defecto (no determinada)
      }
    }
  }

  /**
   * @description: Modifica el color de los elementos de cada lista, en función del estado de dicho elemento.
   * @param id: Id del elemento seleccionado por el usuario
   * @param column: Usado para evitar que confundamos el pulsar el mismo elemento dos veces en lugar del par correctamente
   * TODO: Establecer colores de los elementos con el ID entrante en la funcion en caso de no suceder un error
   */
  setElementColour(id: number, column: number): number {
    let auxMap = new Map<number, number>(); // Declaramos mapa auxiliar
    auxMap = this.idResultsMap.get(id);
    switch (auxMap.get(column)) {
      case 3:
        return 3;
      case 2:
        return 2;
      case 1:
        return 1;
      case 0:
        return 0;
      default:
        confirm('Valor erroneo');
        break;
    }
  }

  setElementColourB(id: number, column: number): string {
    let auxMap = new Map<number, number>(); // Declaramos mapa auxiliar
    auxMap = this.idResultsMap.get(id);
    switch (auxMap.get(column)) {
      case 3:
        return 'light';
      case 2:
        return 'warning';
      case 1:
        return 'success';
      case 0:
        return 'danger';
      default:
        confirm('Valor erroneo');
        break;
    }
  }

/**
 * Crea un delay/sleep/Timer o callback en la aplicación. Usado con la función async/await permitiremos que dicho callback sea asincrono al resto de la app.
 * SEJMM DS003.1; Implementación de Timer asincrono para devolver el estado por defecto a las duplas incorrectas pasado un tiempo determinado.
 * @param ms: Tiempo usado en el timer.
 */
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
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
