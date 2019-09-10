/* SEJMM DS009; Creación y gestión de formulario */
import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
// import { DomSanitizer } from '@angular/platform-browser';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Keyboard } from '@ionic-native/keyboard/ngx'; /* SEJMM DS010; Ionic KeyBoard */

@Component({
  selector: 'app-form-creation',
  templateUrl: './form-creation.page.html',
  styleUrls: ['./form-creation.page.scss'],
})
export class FormCreationPage implements OnInit {
  @Input() value: any; // Util para pasar un parametro. P.E: Nombre de tabla ya creada

  validation_form: FormGroup; // Declaración del grupo de control de formulario
  duplaCount = 0; // Contador del numero de duplas Español/Inglés añadidas al formulario

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
    // private sanitizer: DomSanitizer,
    public formBuilder: FormBuilder,
    private db: DatabaseService,
    public keyboard: Keyboard /* SEJMM DS010; Definimos como pública para poder acceder a ella desde el HTML */
  ) { }

  ngOnInit() {
    // this.form-creation = this.sanitizer.bypassSecurityTrustStyle(this.value);
    this.validation_form = this.formBuilder.group({
      tableName: new FormControl('', Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        // Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]*'), // Se admitiran nombres de tabla que solo tengan letras y espacios
        Validators.required
      ]))
    });

  }

  /**
   * @description Cierra el modal
   */
  closeModal() {
    this.modalCtrl.dismiss('¡Tabla creada!');
  }

  /**
   * @description Incrementa el número de elementos de control y añade su dupla en español y en inglés.
   */
  addControl() {
    this.validation_form.addControl('par' + (this.duplaCount + 1), new FormGroup({
      spanishName: new FormControl('', Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]*'), Validators.required])),
      englishName: new FormControl('', Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ ]*'), Validators.required]))
    }));
    console.log('Contador duplas: ' + this.duplaCount);

    this.duplaCount++;
    console.log('Contador duplas después: ' + this.duplaCount);

  }
  /**
   * @description Elimina dupla de elementos de control español y en inglés.
   * @param control Control a eliminar
   */
  removeControl(control) {
    const controlKey: string = control.key;
    console.log('Eliminar dupla de controles: ' + controlKey);
    this.validation_form.removeControl(controlKey);
  }
  /**
   * @description Función encargada de implementar las llamadas adecuadas a la base de datos en función de los campos del formulario
   * @param values Valores introducidos en el formulario en formato json. PE: {username: "JmacArrow", name: "Javier", lastname: "M" ...
   */
  onSubmit(tableNameValue) {
    console.log('onSubmit: Nombre tabla: ' + tableNameValue.tableName);

    /* Creamos tabla en DB */
    this.db.createTable(tableNameValue.tableName);

    /* Iteramos sobre el array/object de valores devueltos desde el formulario obteniendo sus propiedades de objeto con for-in
    *  y añadimos dichos valores a la tabla en DB.
    */
    for (const prop in tableNameValue) {
      if (prop !== 'tableName') {
        console.log('onSubmit: Elemento en español añadido: ' + tableNameValue[prop].spanishName);
        console.log('onSubmit: Elemento en inglés añadido: ' + tableNameValue[prop].englishName);
        this.db.addTableElement(tableNameValue.tableName, tableNameValue[prop].spanishName, tableNameValue[prop].englishName);
      }
    }

    this.closeModal(); // Para finalizar, cerramos el modal
  }

}
