import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
/* SEJMM INI DS002; SQLite Database */
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
/* SEJMM FIN DS002; SQLite Database */
import { Keyboard } from '@ionic-native/keyboard/ngx'; /* SEJMM DS010; Ionic KeyBoard */
// Modal Pages
import { FormCreationPageModule } from './pages/modal/form-creation/form-creation.module';
import { FormModPageModule } from './pages/modal/form-mod/form-mod.module'; // DS009.1: Implementación de formulario para modificación de tablas
import { SearchFilterPageModule } from './pages/modal/search-filter/search-filter.module';
// Components
import { NotificationsComponent } from './components/notifications/notifications.component';

@NgModule({
  declarations: [AppComponent, NotificationsComponent], // SEJMM; Declaramos componentes
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormCreationPageModule,
    FormModPageModule, // DS009.1: Implementación de formulario para modificación de tablas
    SearchFilterPageModule
  ],
  entryComponents: [NotificationsComponent], // SEJMM; Necesario para poder utilizarlo como un router component y cargarlo imperativamente
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    /* SEJMM INI DS0002 */
    SQLite,
    SQLitePorter,
    /* SEJMM FIN DS0002 */
    Keyboard /*SEJMM DS010 */
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
