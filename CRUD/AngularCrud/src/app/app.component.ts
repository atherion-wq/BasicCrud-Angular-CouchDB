import { Component } from '@angular/core';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { Contacto } from './models/Contacto'
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';
import { ToastrModule } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  title = 'app';

  listaContactos: Contacto[] = [];

  
 
  contactoMarcado: Contacto = new Contacto()


  datosCompletos(contacto: Contacto): boolean{
    if (contacto.Correo === "" || contacto.Profesion ==="" || (contacto.telefono) === "" 
    || contacto.nombre ==="" || contacto.apellido1 ===""|| contacto.apellido2===""){
        return false;
    }
    else{
      return true;
    }
  }

  ngOnInit(){
   this.cargar()
  }

  cicloRellenar(r: any){
    
    r.forEach(element => {
       this.contactoMarcado.id= element.id
       this.contactoMarcado.identificador= element.value.identificador
       this.contactoMarcado.nombre = element.value.nombre
       this.contactoMarcado.apellido1 = element.value.apellido
       this.contactoMarcado.apellido2 = element.value.apellido2
       this.contactoMarcado.telefono = element.value.telefono
       this.contactoMarcado.telefono2 = element.value.telefono2
       this.contactoMarcado.Correo = element.value.correo
       this.contactoMarcado.Profesion = element.value.Profesion
       this.contactoMarcado.rev = element.value.rev 
      this.listaContactos.push(this.contactoMarcado)
      this.contactoMarcado = new Contacto();
    
    });
  }

  cargar(){
    this.listaContactos = []
    var url = "http://localhost:3000/contactos/cargar";
    this.http.get(url).subscribe(res=>{
    var r = res["contactos"];
      console.log(r);
    this.cicloRellenar(r)
    });
  }

  agregar(){
    if (this.datosCompletos(this.contactoMarcado)) {
      let body = new HttpParams();
      body = body.set('identificador',"1");
      body = body.set('nombre', this.contactoMarcado.nombre);
      body = body.set('apellido', this.contactoMarcado.apellido1);
      body = body.set('apellido2',this.contactoMarcado.apellido2);
      body = body.set('telefono', (this.contactoMarcado.telefono));
      body = body.set('telefono2', (this.contactoMarcado.telefono2));
      body = body.set('correo', this.contactoMarcado.Correo);
      body = body.set('profesion', this.contactoMarcado.Profesion);

      var url = "http://localhost:3000/contactos/agregar";
      return this.http.post(url,body).subscribe(
        data=> {
          alert('Se guardo con exito.');
          this.eliminarDatos();
          
        },
        error => {
          
          alert('Error al guardar');
          console.log(JSON.stringify(error));
          this.eliminarDatos();
        }
      )
    }
    else{
      alert('Rellene todo el formulario.');
    }
  }

  eliminarDatos(){
    this.contactoMarcado = new Contacto()
    this.cargar();
    window.location.reload()
  }

 
  completarEditar(){
    if (this.datosCompletos(this.contactoMarcado)) {
      let body = new HttpParams();
      body = body.set('id',this.contactoMarcado.id);
      body = body.set('rev', this.contactoMarcado.rev);
      body = body.set('nombre', this.contactoMarcado.nombre);
      body = body.set('apellido', this.contactoMarcado.apellido1);
      body = body.set('apellido2',this.contactoMarcado.apellido2);
      body = body.set('telefono', (this.contactoMarcado.telefono));
      body = body.set('telefono2', (this.contactoMarcado.telefono2));
      body = body.set('correo', this.contactoMarcado.Correo);
      body = body.set('profesion', this.contactoMarcado.Profesion);

      var url = "http://localhost:3000/contactos/actualizar";
      return this.http.post(url,body).subscribe(
        data=> {
          alert('Se actualizado el contacto.');
          this.eliminarDatos()
        },
        error => {
          alert('Error al actualizar el contacto');
          this.eliminarDatos();
          console.log(JSON.stringify(error));
        }
      )
    }
    else{
      alert('Complete el formulario antes de intentar terminar de editar.');
    }
    
  }


  CargarParaEditar(contacto: Contacto ){
    this.contactoMarcado = contacto
  }


  onDelete(contacto:Contacto) {
    if(confirm('Seguro que quiere Eliminarlo?')) {
      let body = new HttpParams();
      body = body.set('id',contacto.id);
      body = body.set('rev', contacto.rev);
      var url = "http://localhost:3000/contactos/eliminar";
      return this.http.post(url,body).subscribe(
      data=> {

        alert('Se borrado el contacto.');
        this.eliminarDatos();
          
      },
      error => {
        alert('Error al intentar borrar el contacto.');
        this.eliminarDatos();
        console.log(JSON.stringify(error));
      }
    )}
  }




}
