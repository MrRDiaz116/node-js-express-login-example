const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Vitals = db.vitals;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.findAllId = (req, res) => {
    const id_cliente = req.params.id_cliente;
    //var condition = id_cliente ? { id_cliente: { [Op.like]: `%${id_cliente}%` } } : null;
    
    Vitals.findAll({where: {id_cliente: id_cliente} })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Un error sucedió al localizar los datos."
            });
          });
  };