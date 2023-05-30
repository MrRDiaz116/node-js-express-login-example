const db = require("../models_desensibilizada/index");
const db_normal = require("../models/index");
const Vitals = db.vitals_desensibilizada;
const util = require("node:util")
const User = db_normal.user;


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cry = require("../controllers/cryp.controller");


exports.createVitals = async (req, res) => {
  
    const id_sucursal_ = 3;
    const userid = req.params.userid;

    const user = await User.findByPk(userid);

    const nombre = user.nombre;
    const apellido_paterno = user.apellido_paterno;
    const apellido_materno = user.apellido_materno;
    const a_nacimiento = user.a_nacimiento;
    const placeholder_h = user.placeholder_h;

    const id_hash_ =  cry.sacarHash(nombre, apellido_paterno, apellido_materno, a_nacimiento, placeholder_h);
  
    const vital = await Vitals.create({ 
      id_hash: id_hash_,  
      id_sucursal: id_sucursal_,
      ritmo_cardiaco: req.body.ritmo_cardiaco, 
      frecuencia_respiratoria: req.body.frecuencia_respiratoria, 
      peso: req.body.peso, 
      indice_masa_corporal: req.body.indice_masa_corporal, 
      saturacion_oxigeno: req.body.saturacion_oxigeno, 
      temperatura: req.body.temperatura, 
      presion_sanguinea_sistolica: req.body.presion_sanguinea_sistolica, 
      presion_sanguinea_diastolica: req.body.presion_sanguinea_diastolica, 
      altura: req.body.altura, 
      //date_time: req.body.date_time
    }

    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Sucedió un error al localizar los datos."
            });
          });
    
  };