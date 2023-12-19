const sqlite3 = require('sqlite3').verbose();


const DB_PATH = './retailDB.sqlite';

// Función para leer datos de una base de datos SQLite
function leerDatosSQLite(dbPath, query, callback) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Conectado a la base de datos SQLite.');
    });

    db.all(query, [], (err, rows) => {
        if (err) {
            throw err;
        }
        db.close();
        callback(rows);
    });
}

const QUERY_DE_PRODUCTOS = 'SELECT product_id as id, product_name as name, description FROM info limit 1'; 

function leerDatosProductos() {
    // Ejemplo de uso

    return new Promise((done) => {
        leerDatosSQLite(DB_PATH, QUERY_DE_PRODUCTOS, (datos) => {
            // Convertir los datos a un formato de texto
            return done(JSON.stringify(datos));
        });
    })
}

exports.leerDatosProductos = leerDatosProductos;
