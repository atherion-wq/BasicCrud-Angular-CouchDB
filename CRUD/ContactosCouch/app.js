const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb');

const couch = new   NodeCouchDb({
    auth:{
        user: 'admin',
        password: 'cr99danie31'
    }
}); 

couch.listDatabases().then(function(dbs){
    console.log(dbs)
});

const dbName= 'contactos';
const viewUrl = '_design/todo_contactos/_view/todo';

const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));






//Lee los datos que vienen desde una vista
app.get('/',function(req,res){
    couch.get(dbName,viewUrl).then(
        function(data,header,status){
            res.render('index',{contactos:data.data.rows});
        },
        function(err){
            res.send(err);
        });
});




app.get('/contactos/cargar',function(req,res){
    couch.get(dbName,viewUrl).then(
        function(data,header,status){
            res.send({contactos:data.data.rows});
        },
        function(err){
            res.send(err);
            
        });
});

// Esto agrega los datos que salen desde la ventana
app.post('/contactos/agregar',function(req,res){
    const identificador = req.body.identificador;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const apellido2 = req.body.apellido2;
    const telefono = req.body.telefono;
    const telefono2 = req.body.telefono2;
    const correo = req.body.correo;
    const profesion = req.body.profesion;

    couch.uniqid().then(function(ids){
        const id = ids[0];
        
        couch.insert('contactos',{
            _id:id,
            identificador:identificador,
            nombre: nombre,
            apellido:apellido,
            apellido2: apellido2,
            telefono:telefono,
            telefono2:telefono2,
            correo:correo,
            Profesion:profesion
        }).then(
            function(data,headers,status){
                res.send(data);
            },
            function(err){
                res.send(err);
            });
    })
});

// Eliminan los datos que viene desde la ventana.
app.post('/contactos/eliminar',function(req,res){
    const id = req.body.id;
    const rev = req.body.rev;

    couch.del(dbName,id,rev).then(
        function(data,headers,status){
            res.send(data);
        },
        function(err){
            res.send(err);
        });
});

app.post('/contactos/actualizar',function(req,res){
    const id = req.body.id;
    const rev = req.body.rev;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const apellido2 = req.body.apellido2;
    const telefono = req.body.telefono;
    const telefono2 = req.body.telefono2;
    const correo = req.body.correo;
    const profesion = req.body.profesion;
    
    couch.update(dbName, {
        _id: id,
        _rev: rev,
        nombre: nombre,
        apellido:apellido,
        apellido2: apellido2,
        telefono:telefono,
        telefono2:telefono2,
        correo:correo,
        Profesion:profesion
    }).then(({data, headers, status}) => {
        res.send(data);
        
    }, err => {
       res.send(err)
    });
});


app.listen(3000,function(){
    console.log('El servidor Inicio en el puerto 3000');
});
