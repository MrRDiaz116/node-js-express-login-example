const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Vitals = db.vitals;
const Op = db.Sequelize.Op;
const util = require("node:util")


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");




exports.findAllId = async (req, res) => {
  
    
    const userid = req.params.userid;
    //var condition = id_cliente ? { id_cliente: { [Op.like]: `%${id_cliente}%` } } : null;
    const vital = await Vitals.findAll({
      attributes: [
        `id_cliente`,`ritmo_cardiaco`, `frecuencia_respiratoria`, `peso`, `indice_masa_corporal`, `saturacion_oxigeno`, `temperatura`, `presion_sanguinea_sistolica`, `presion_sanguinea_diastolica`, `altura`
      ],
      where: {id_cliente: userid} })
        .then(data => {
            console.log(data);
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Un error sucedió al localizar los datos."
            });
          });
    
  };