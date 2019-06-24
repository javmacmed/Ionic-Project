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
  idResultsMap = new Map<number, number[]>(); // Mapa para almacenar las relaciones id-resultado del juego
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
    /* Inicializamos el mapa id-resultados para cada entrada en la tabla de animales con la que se va a jugar. De este
      modo definiremos como valor por defecto para el resultado 2 (Aun no elegido).
    */
    for (const id of this.animals) {
      this.idResultsMap.set(id.id, [2, 2]);
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
    if (this.numWordsSelected === 0) {
      this.numWordsSelected++;
      this.idOfWordSelected = id;
    } else if (this.numWordsSelected === 1 && this.lastElemColumnSelected !== column) {
      this.numWordsSelected = 0; // Reiniciamos el contador
      this.lastElemColumnSelected = 2; // Reiniciamos la columna anterior a por defecto (no determinada)
      // Añadimos/modificamos par clave-valor
      if (this.idOfWordSelected === id) {
        this.idResultsMap.set(id, [1, column]); // Correcto
      } else {
        this.idResultsMap.set(id, [0, column]); // Incorrecto
      }
    } else {
      this.numWordsSelected = 0; // Reiniciamos el contador
      this.lastElemColumnSelected = 2; // Reiniciamos la columna anterior a por defecto (no determinada)
    }
  }
}
