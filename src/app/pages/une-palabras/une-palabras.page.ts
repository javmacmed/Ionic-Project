/**
 * SEJMM DS003 09/06/2019; Servicio para controlar nuestra base de datos SQLite
 * */

import { Component, OnInit } from '@angular/core';
import { DatabaseService, Elem } from './../../services/database.service'; // Importamos clases DB
import { Observable } from 'rxjs';

@Component({
  selector: 'app-une-palabras',
  templateUrl: './une-palabras.page.html',
  styleUrls: ['./une-palabras.page.scss'],
})
export class UnePalabrasPage implements OnInit {

  numWordsSelected = 0;
  lastElemColumnSelected = 2; // Última columna seleccionada; 0: izquierda, 1: derecha, 2: No determinada
  idOfWordSelected: number;
  animals: Elem[] = [];
  idResultsMap = new Map<number, Map<number, number>>(); // Mapa para almacenar las relaciones id-resultado del juego en función de las columnas
  animal = {}; // NOTA: Esto sería para añadir en el ts de la pagina formulario para añadir elementos a la lista que sea

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getAnimals().subscribe(anim => {
          this.animals = anim;
        });
      }
    });
    /* Inicializamos el mapa id-valorMap<idColumna, valor> para cada entrada en la tabla de animales con la que se va a jugar. De este
      modo definiremos como valor por defecto 3 (Color por defecto, no elegido).
    */
    for (const id of this.animals) {
      const auxMap = new Map<number, number>();
      auxMap.set(0, 3); // Columna izquierda; Color default
      auxMap.set(1, 3); // Columna derecha; Color default
      this.idResultsMap.set(id.id, auxMap);
    }
  }

  // NOTA: Estas dos siguientes funciones serían para añadir u obtener en el ts de la pagina formulario
  // para añadir elementos a la lista que sea.
  /**
   * @description: Obtiene un animal desde la tabla dado un ID.
   * @param id: Id del elemento seleccionado por el usuario
   */
  getAnimal(id: number): Promise<Elem> {
    return this.db.getAnimal(id);
  }
  /**
   * @description: Añade un animal a la tabla
   */
  addAnimal() {
    this.db.addAnimal(this.animal['spanishName'], this.animal['englishName'])
      .then(_ => {
        this.animal = {};
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
    const auxMap = new Map<number, number>(); // Declaramos mapa auxiliar
    if (this.numWordsSelected === 0) {
      auxMap.set(column, 2); // Primer botón de la combinación pulsado; Color amarillo
      this.numWordsSelected++;
      this.idOfWordSelected = id;
      this.idResultsMap.set(id, auxMap); // Asignamos al mapa global de combinaciones.
    } else if (this.numWordsSelected === 1 && this.lastElemColumnSelected !== column) {
      this.numWordsSelected = 0; // Reiniciamos el contador
      this.lastElemColumnSelected = 2; // Reiniciamos la columna anterior a por defecto (no determinada)
      // Añadimos/modificamos par clave-valor
      if (this.idOfWordSelected === id) {
        auxMap.set(column, 1); // Segundo botón de la combinación pulsado; Valor correcto; Color verde
        this.idResultsMap.set(id, auxMap); // Correcto
      } else {
        auxMap.set(column, 0); // Segundo botón de la combinación pulsado; Valor correcto; Color verde
        this.idResultsMap.set(id, auxMap); // Incorrecto
      }
    } else {
      this.numWordsSelected = 0; // Reiniciamos el contador
      this.lastElemColumnSelected = 2; // Reiniciamos la columna anterior a por defecto (no determinada)
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
}
