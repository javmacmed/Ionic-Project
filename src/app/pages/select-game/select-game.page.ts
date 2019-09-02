import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular'; // SEJMM DS007: Preparación multitabla
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-game',
  templateUrl: './select-game.page.html',
  styleUrls: ['./select-game.page.scss'],
})
export class SelectGamePage implements OnInit {

  tableNameArg = null; // DS007: Preparación multitabla

  constructor(public navCtrl: NavController,
    private activeRoute: ActivatedRoute // DS007: Preparación multitabla
    ) { }

  ngOnInit() {
    this.tableNameArg = this.activeRoute.snapshot.paramMap.get('tableName'); // Obtenemos la tabla enviada desde select-table. DS007: Preparación multitabla
  }

  goToUnePalabras() {
    this.navCtrl.navigateForward(['/une-palabras', this.tableNameArg]);
  }

  goToDiMiNombre() {
    this.navCtrl.navigateForward(['/di-mi-nombre', this.tableNameArg]);
  }
}
