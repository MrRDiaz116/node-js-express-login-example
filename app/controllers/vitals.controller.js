const db = require("../models");
const Vitals = db.vitals;
const util = require("node:util")


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.createVitals = async (req, res) => {
  
    
    const userid = Number(req.params.userid);
    const id_sucursal_ = 3;

    const vital = await Vitals.create({ 
      id_cliente: userid, 
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