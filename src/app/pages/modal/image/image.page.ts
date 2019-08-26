/* SEJMM DS009; Creación y gestión de formulario */
import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController, NumericValueAccessor } from '@ionic/angular';
// import { DomSanitizer } from '@angular/platform-browser';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  @Input() value: any; // Util para pasar un parametro. P.E: Nombre de tabla ya creada
  // public image: any;
  validation_form: FormGroup; // Declaración del grupo de control de formulario
  elems_form: FormGroup;
  newgroup: FormGroup;
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
    private db: DatabaseService
  ) { }

  ngOnInit() {
    // this.image = this.sanitizer.bypassSecurityTrustStyle(this.value);
    this.validation_form = this.formBuilder.group({
      tableName: new FormControl('', Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        // Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.pattern('[a-zA-Z ]*'), // Se admitiran nombres de tabla que solo tengan letras y espacios
        Validators.required
      ]))
      // ,
      // name: new FormControl('', Validators.required),
      // lastname: new FormControl('', Validators.required),
      // email: new FormControl('', Validators.compose([
      //   Validators.required,
      //   Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      // ])),
      // gender: new FormControl(this.genders[0], Validators.required),
      // country_phone: this.country_phone_group,
      // matching_passwords: this.matching_passwords_group,
      // terms: new FormControl(true, Validators.pattern('true'))
    });
    this.elems_form = this.formBuilder.group({

    });
  }
  closeModal() {
    this.modalCtrl.dismiss('¡Tabla creada!');
  }
  /**
   * @description Incrementa el número de elementos de control y añade su dupla en español y en inglés.
   */
  addControl() {
    this.newgroup = this.formBuilder.group({});
    this.newgroup.addControl('spanishName', new FormControl('', Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])));
    this.newgroup.addControl('englishName', new FormControl('', Validators.compose([Validators.maxLength(15), Validators.minLength(2), Validators.pattern('[a-zA-Z ]*'), Validators.required])));
    this.elems_form.addControl('par' + (this.duplaCount + 1), this.newgroup);
    console.log('Contador duplas: ' + this.duplaCount);
    console.log('spanishName' + (this.duplaCount + 1));
    console.log('englishName' + (this.duplaCount + 1));
    this.duplaCount++;
    console.log('Contador duplas después: ' + this.duplaCount);

  }
  /**
   * @description Elimina dupla de elementos de control español y en inglés.
   */
  removeControl(control) {
    const controlKey: string = control.key;
    const controlSuffixNumber: number = parseInt(controlKey.match(/\d+/)[0], 10); // Parseamos identificador de control de entrada y obtenemos su parte numerica
    console.log('Eliminar dupla de controles: ' + controlKey);
    this.elems_form.removeControl(control.key);
  }
  /**
   * @description Función encargada de implementar las llamadas adecuadas a la base de datos en función de los campos del formulario
   * @param values Valores introducidos en el formulario en formato json. PE: {username: "JmacArrow", name: "Javier", lastname: "M" ...
   */
  onSubmit(tableNameValue, elemsFormValue) {
    console.log('TableNameValues: ' + tableNameValue);
    console.log('ElemsFormValue: ' + elemsFormValue);
    this.db.createTable(tableNameValue.tableName);
    this.closeModal(); // Para finalizar, cerramos el modal
  }

}
