/**
 * Descripción: Componente/pagina que implementa la posibilidad de selección de la tabla de la DB que se desea utilizar en el juego.
 * First version: SEJMM DS008 11/08/2019; Desarrollo página elige-tabla.
 * */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from './../../services/database.service'; // Importamos clases DB
import { NavController} from '@ionic/angular'; // SEJMM DS007: Preparación multitabla
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción

@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.page.html',
  styleUrls: ['./select-table.page.scss'],
})
export class SelectTablePage implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject();
  tablesArrayName: string[] = [];

  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    public navCtrl: NavController // SEJMM DS007: Preparación multitabla
    ) { }

  ngOnInit() {
    this.db.getDatabaseState().pipe(takeUntil(this.unsubscribe$)).subscribe(rdy => {
      if (rdy) {
        this.db.loadTables();
        this.db.getTables().pipe(takeUntil(this.unsubscribe$)).subscribe(tables => {
          this.tablesArrayName = tables;
          /* Ordenamos las tablas en orden alfabético */
          this.tablesArrayName.sort(function (a, b) {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
          });
        });
      }
    });
  }

  ngOnDestroy() {
    console.log('Select Table: ngOnDestroy');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  goToSelectGame(tableName: string) {
    this.navCtrl.navigateForward(['/select-game', tableName]);
  }
}
