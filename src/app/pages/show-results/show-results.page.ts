/**
 * Descripción: Componente que implementa toda la lógica asociada a los elementos HTML en di-mi-nombre.page.html
 * First version: SEJMM DS011 08/09/2019; Desarrollo 'Show Results';
 * */
import { Component, OnInit } from '@angular/core';
import { DatabaseService, ResElem} from './../../services/database.service'; // Importamos clases DB
import { Subject, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción

@Component({
  selector: 'app-show-results',
  templateUrl: './show-results.page.html',
  styleUrls: ['./show-results.page.scss'],
})
export class ShowResultsPage implements OnInit {
  private unsubscribe$: Subject<void> = new Subject();
  /** Atributos de clase **/
  tableArrayResElements: ResElem[] = []; // DS011: Tabla de resultados obtenida desde DB para sumar resultados de esta ronda
  tablesArrayName: string[] = []; // DS011; Todas las tablas para buscar entre ellas la tabla concerniente a esta version de Di mi nombre
  auxResElem: ResElem;
  ok = false;
  argumentos = null; // DS007: Preparación multitabla
  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    private activeRoute: ActivatedRoute // DS007: Preparación multitabla

  ) { }

  ngOnInit() {
    this.argumentos = this.activeRoute.snapshot.paramMap.get('tableName'); // Obtenemos la tabla enviada desde select-table. DS007: Preparación multitabla
    const resultTableName = 'res_' + this.argumentos + '_diminombre';
    this.db.getDatabaseState().pipe(takeUntil(this.unsubscribe$)).subscribe(rdy => {
      if (rdy) {
        /* Cargamos tabla de elementos para mostrar en los slides */
        this.db.loadTableForResults(this.argumentos);
        /* Cargamos tablas para obtener al finalizar el juego la tabla resultados que corresponde en caso de existir (DS011)*/
        this.db.loadTablesForResults();
        this.db.getTablesForResults()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(tableResult => {
          this.tablesArrayName = tableResult;
        });

        if (this.tablesArrayName.includes(resultTableName)) {
          // Si la tabla ya existe
          this.db.loadTableForResults(resultTableName);
          this.db.getSelectedTableForResults()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(tableResult => {
            this.tableArrayResElements = tableResult;
            this.auxResElem = {
              id: this.tableArrayResElements[0].id,
              aciertos: this.tableArrayResElements[0].aciertos,
              errores: this.tableArrayResElements[0].errores
            };
            this.ok = true;
          });
        }
      }
    });
  }

}
