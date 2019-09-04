/**
 * Descripción: Tuberia para reordenar aleatoriamente el orden en que se dispondran los elementos en las columnas del juego.
 * First version: 26/06/2019; SEJMM DS003.3: Tuberia para reordenar aleatoriamente un array.
 * */

import { Pipe, PipeTransform } from '@angular/core';
import { Elem } from './../services/database.service'; // Importamos clases DB

@Pipe({name: 'alterOrder'})
export class AlterOrderPipe implements PipeTransform {
    transform(arrayToOrder: Array<Elem>, args: string[]): any {
        const alterOrderedArray = [];
        for (const elem in arrayToOrder) {
            if (elem !== null && elem !== undefined) {
                // Funcionalidad que implementa la reodenación aleatoria en un nuevo array.
                let randomIndex = Math.floor(Math.random() * arrayToOrder.length);
                while (alterOrderedArray.includes(arrayToOrder[randomIndex])) {
                    randomIndex = Math.floor(Math.random() * arrayToOrder.length);
                }
                alterOrderedArray.push(arrayToOrder[randomIndex]);
            }
        }
        return alterOrderedArray;
    }
}
