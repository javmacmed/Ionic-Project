/* SEJMM DS009.1: Implementación de formulario para modificación de tablas */
import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Validators, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { DatabaseService, Elem } from 'src/app/services/database.service';
import { Keyboard } from '@ionic-native/keyboard/ngx'; /* SEJMM DS010; Ionic KeyBoard */
import { skip, take} from 'rxjs/operators'; // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
import { Observable } from 'rxjs';
// Components
import { AlertController } from '@ionic/angular'; // SEJMM DS009.3: Alert mostrado para confirmar borrado de tabla y elemento de tabla.

@Component({
  selector: 'app-form-mod',
  templateUrl: './form-mod.page.html',
  styleUrls: ['./form-mod.page.scss'],
})
export class FormModPage implements OnInit {
  // Data passed in by componentProps
  @Input() tableNameInput: string; // Nombre de la tabla de entrada

  validation_form: FormGroup; // Declaración del grupo de control de formulario
  duplaCount: number; // TODO: (MODIFICAR POR NUMERO EN DE CONTROLES EN TABLA) | Contador del numero de duplas Español/Inglés añadidas al formulario
  tableArrayElements: Elem[] = []; // DS007: Preparación multitabla
  idControlMap: Map<AbstractControl, Elem>; // Mapa para almacenar las relaciones id-duplaDeControles
  validation_messages = { // Mensajes de validación para cada una de las validaciones realizadas en cada control de formulario
    'tableName': [
      { type: 'required', message: 'Nombre de tabla requerido.' },
      { type: 'minlength', message: 'Nombre de tabla debe tener al menos 3 carácteres.' },
      { type: 'maxlength', message: 'Nombre de tabla no puede tener más de 20 carácteres.' },
      { type: 'pattern', message: 'Nombre de tabla debe contener solo letras y espacios' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    'duplaControlMessages': [
      { type: 'required', message: 'Nombre de tabla requerido.' },
      { type: 'minlength', message: 'Nombre de tabla debe tener al menos 2 carácteres.' },
      { type: 'maxlength', message: 'Nombre de tabla no puede tener más de 15 carácteres.' },
      { type: 'pattern', message: 'Nombre de tabla debe contener solo letras y espacios' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ]
  };

  constructor(
    private nav: NavController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    public keyboard: Keyboard, /* SEJMM DS010; Definimos como pública para poder acceder a ella desde el HTML */
    public alertController: AlertController // SEJMM DS009.3: Alert mostrado para confirmar borrado de tabla y elemento de tabla.
  ) { }

  ngOnInit() {
    /* Inicializamos las variables globales del modal */
    this.duplaCount = 0;

    this.idControlMap = new Map<AbstractControl, Elem>();
    /* Creamos el control para el nombre de la tabla con su valor en DB */
    this.validation_form = this.formBuilder.group({
      tableName: new FormControl(this.tableNameInput, Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]*'), // Se admitiran nombres de tabla que solo tengan letras y espacios
        Validators.required
      ]))
    });

    /* Obtenemos las columnas de la tabla pasada como input para crear los controles de éstas */
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadTable(this.tableNameInput);
        // A continuación nos suscribiremos al observable que almacena el resultado de SELECT * FROM TABLE desuscribiendonos inmediatamente despues con la pipe(take(1))
        this.db.getSelectedTable()
        .pipe(skip(1), take(1)) // Operadores multiples seguiran orden dentro de parentesis, skip(1) salta el primer valor por defecto y coge el obtenido mediante next().
        .subscribe(table => { // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
          this.tableArrayElements = table;
          /* Añadimos todas las duplas de controles existentes en DB */
          for (const elem of this.tableArrayElements) {
            this.addExistingControl(elem);
          }
          console.log('Contador duplas después de añadir todos los elementos en db: ' + this.duplaCount);
        });
      }
    });
  }

 /**
 * @description Cierra el modal
 */
  closeModal() {
    this.modalCtrl.dismiss('¡Tabla creada!');
  }

  /**
   * @description Incrementa el número de elementos de control y añade su dupla en español y en inglés ya existente en la Base de Datos de la tabla.
   * @param elem Elemento con dupla de valores a añadir
   */
  addExistingControl(elem: Elem) {
    const controlGroupName = 'par' + (this.duplaCount + 1);
    this.validation_form.addControl(controlGroupName, new FormGroup({
      spanishName: new FormControl(elem.spanishName, Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]*'), Validators.required])),
      englishName: new FormControl(elem.englishName, Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]*'), Validators.required]))
    }));
    this.duplaCount++;
    /* Obtenemos el control abstracto que acabamos de añadir y lo añadimos como valor del id (clave) en el mapa que hemos definido */
    const controlAdded: AbstractControl = this.validation_form.get(controlGroupName);
    this.idControlMap.set(controlAdded, elem);
  }

   /**
   * @description Incrementa el número de elementos de control y añade su dupla en español y en inglés.
   */
  addControl() {
    this.validation_form.addControl('par' + (this.duplaCount + 1), new FormGroup({
      spanishName: new FormControl('', Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]*'), Validators.required])),
      englishName: new FormControl('', Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]*'), Validators.required]))
    }));
    console.log('Contador duplas: ' + this.duplaCount);

    this.duplaCount++;
    console.log('Contador duplas después: ' + this.duplaCount);
  }

  /**
   * @description Elimina dupla de elementos de control español y en inglés. También elimina el elemento de la base de datos si éste ya se encuentra en ella.
   * @param control Control a eliminar
   */
  removeControl(control) {
    const controlKey: string = control.key;
    console.log('Eliminar dupla de controles: ' + controlKey);
    const controlAux: AbstractControl = this.validation_form.get(controlKey); // Obtenemos el AbstractControl de validation_form antes de borrarlo

    /* En caso de ser un control/dupla ya existente en mapa/DB la eliminamos de ésta*/
    if (this.idControlMap.has(controlAux)) {
      this.presentAlertConfirmDeletion(this.tableNameInput, this.idControlMap.get(controlAux).id, controlKey);
    } else {
      // Borramos control en el formulario
      this.validation_form.removeControl(controlKey);
    }
  }

   /**
   * SEJMM DS009.3: Alert mostrado para confirmar borrado de tabla y elemento de tabla.
   * @description: Presenta el alert para confirmación de borrado
   * @param table: Tabla a presentar en el modal
   * @param id: Id del elemento de la tabla que se va a borrar
   * @param controlKey: Nombre del control que se va a eliminar
   */
  async presentAlertConfirmDeletion(tableName: string, id: number, controlKey: string) {
    const alert = await this.alertController.create({
      header: 'Borrando Elemento Almacenado',
      message: '¿Está seguro de que desea <strong>eliminar el elemento definitivamente</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Borrado confirmado');
            // Borramos elemento de la DB
            this.db.deleteTableElement(id, tableName);
            // Borramos control en el formulario
            this.validation_form.removeControl(controlKey);
          }
        }
      ],
      mode: 'ios'
    });

    await alert.present();
  }

  /**
   * @description Función encargada de implementar las llamadas adecuadas a la base de datos en función de los campos del formulario
   * @param values Valores introducidos en el formulario en formato json. PE: {username: "JmacArrow", name: "Javier", lastname: "M" ...
   */
  onSubmit(tableNameValue) {
    console.log('onSubmit: Nombre tabla: ' + tableNameValue.tableName);

    /* Modificamos nombre de tabla en DB por nombre obtenido desde control */
    this.db.updateTableName(this.tableNameInput, tableNameValue.tableName);

    /* Iteramos sobre el array/object de valores devueltos desde el formulario obteniendo sus propiedades de objeto con for-in
    *  y añadimos dichos valores a la tabla en DB.
    */
    for (const prop in tableNameValue) {
      if (prop !== 'tableName') {
        /* Si la dupla ya estaba en base de datos, actualizamos su valor */
        const controlAux: AbstractControl = this.validation_form.get(prop); // Obtenemos el AbstractControl del grupo de control evaluado en el for
        if (this.idControlMap.has(controlAux)) { // Comprobamos si dicho grupo de control se haya en el mapa
          /* Definimos Elem auxiliar para sustituir el que esta en el mapa */
          const elemAux: Elem = {
            id: this.idControlMap.get(controlAux).id,
            spanishName: tableNameValue[prop].spanishName,
            englishName: tableNameValue[prop].englishName
          };
          this.idControlMap.set(controlAux, elemAux);
          /* Actualizamos la tabla en DB con el Elem auxiliar creado */
          this.db.updateTableElement(this.idControlMap.get(controlAux), this.tableNameInput);
        } else {
          /* Si es una dupla nueva la añadimos a la base de datos */
          console.log('onSubmit: Elemento en español añadido: ' + tableNameValue[prop].spanishName);
          console.log('onSubmit: Elemento en inglés añadido: ' + tableNameValue[prop].englishName);
          this.db.addTableElement(tableNameValue.tableName, tableNameValue[prop].spanishName, tableNameValue[prop].englishName);
        }
      }
    }

    this.closeModal(); // Para finalizar, cerramos el modal
  }

}
