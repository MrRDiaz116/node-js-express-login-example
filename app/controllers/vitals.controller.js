const db = require("../models");
const Vitals = db.vitals;
const util = require("node:util")


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.findAllId = async (req, res) => {
  
    
    const userid = req.params.userid;
    const vital = await Vitals.findAll({
      attributes: [
        `id_cliente`,`ritmo_cardiaco`, 
        `frecuencia_respiratoria`, `peso`, 
        `indice_masa_corporal`, 
        `saturacion_oxigeno`, `temperatura`,
         `presion_sanguinea_sistolica`, 
        `presion_sanguinea_diastolica`, 
        `altura`, `date_time`
      ],
      where: {id_cliente: userid},
      order: [ [ 'date_time', 'DESC' ]] })
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