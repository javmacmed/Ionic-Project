/**
 * Descripción: Componente/pagina que implementa la posibilidad de selección de la tabla de la DB que se desea utilizar en el juego.
 * First version: SEJMM DS008 11/08/2019; Desarrollo página elige-tabla.
 * */

import { Component, OnInit } from '@angular/core';
import { DatabaseService, Elem } from './../../services/database.service'; // Importamos clases DB
import {NavController } from '@ionic/angular'; // SEJMM DS007: Preparación multitabla
@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.page.html',
  styleUrls: ['./select-table.page.scss'],
})
export class SelectTablePage implements OnInit {

  tablesArrayName: string[] = [];

  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    public navCtrl: NavController // SEJMM DS007: Preparación multitabla
    ) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadTables();
        this.db.getTables().subscribe(tables => {
          this.tablesArrayName = tables;
          this.tablesArrayName.sort(function (a, b) {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
          });
        });
      }
    });
  }

  goToUnePalabras(tableName: string) {
    this.navCtrl.navigateForward(['/une-palabras', tableName]);
  }

}
