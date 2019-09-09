/**
 * Descripción: Componente/pagina que implementa la posibilidad de selección de la tabla de la DB de la cual se desea comprobar los resultados obtenidos.
 * First version: SEJMM DS008 08/09/2019; Desarrollo página results.
 * */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService } from './../../services/database.service'; // Importamos clases DB
import { NavController} from '@ionic/angular'; // SEJMM DS007: Preparación multitabla
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit, OnDestroy {
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
      console.log('Results: ngOnDestroy');
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }

    goToShowResults(tableName: string) {
      this.navCtrl.navigateForward(['/show-results', tableName]);
    }

}
