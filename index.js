const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

const PUERTO = 3000

const conexion = mysql.createConnection(
    {
        host:'localhost',
        database: 'proyecto',
        user: 'root',
        password: ''
    }
)

app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en el puerto ${PUERTO}`);
})

conexion.connect(error => {
    if(error) throw error
    console.log('Conexión a la base de datos realizada correctamente');
})

app.get('/', (req, res) => {
    res.send('API')
})

app.get('/contactos', (req, res) => {

    const query = 'SELECT * FROM contactos;'
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)

        const obj = {}
        if(resultado.length > 0) {
            obj.listaUsuarios = resultado
            res.json(obj)
        } else {
            res.send('No hay registros')
        }
    })
})

app.get('/contacto/:id', (req, res) => {
    const { id } = req.params

    const query = `SELECT * FROM contactos WHERE idUsuario=${id};`
    conexion.query(query, (error, resultado) => {
        if(error) return console.error(error.message)

        if(resultado.length > 0){
            res.json(resultado);
        } else {
            res.send('No hay registros');
        }
    })
})

app.post('/contacto/add', (req, res) => {
    const contacto = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        telefono: req.body.telefono        
    }

    const query = `INSERT INTO contactos SET ?`
    conexion.query(query, contacto, (error) => {
        if(error) return console.error(error.message)

        res.json(`Contacto Registrado`)
    })
})

app.put('/contacto/update/:id', (req, res) => {
    const { id } = req.params
    const { nombre,apellidos,email,telefono } = req.body

    const query = `UPDATE contactos SET nombre='${nombre}', email='${email}', apellidos='${apellidos}', telefono='${telefono}' WHERE idUsuario='${id}';`
    conexion.query(query, (error) => {
        if(error) return console.log(error.message)

        res.json(`Contacto Actualizado`)
    })
})

app.delete('/contacto/delete/:id', (req, res) => {
    const { id } = req.params

    const query = `DELETE FROM contactos WHERE idUsuario=${id};`
    conexion.query(query, (error) => {
        if(error) return console.log(error.message)

        res.json(`Contacto Eliminado`)
    })
})