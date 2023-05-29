const db = require("../models");
const config = require("../config/auth.config");
const cryp = require("../controllers/cryp.controller")
const User = db.user;
const Client = db.client;
const Role = db.role;
const Contact = db.contact;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

exports.signin = (req, res) => {
    Client.findOne({
      where: {
        correo: req.body.correo
      }
    })
      .then(client => {
  
        if (!client) {
          return res.status(404).send({ message: "No se encontró al usuario." });
        };
  
        const formato = 'hex'
        const salt = client.salt;
        const saltPwdCliente = Buffer.from(client.saltPwd,formato);
        const iterations = 480000;
        const length2 = 32;
        const algorithm = 'sha256';
        const originalPassword = client.derivedKeyPwd;
        const bodyPassword = bcrypt.hashSync(req.body.contrasena, salt);
  
        const derivedKeyPwdCliente = crypto.pbkdf2Sync(bodyPassword, saltPwdCliente, iterations, length2, algorithm);
        const comparisionPassword = derivedKeyPwdCliente.toString('hex');
  
        
        var passwordIsValid = originalPassword == comparisionPassword;
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "¡Contraseña inválida!"
          });
        }
        var token = jwt.sign({ id: client.userid }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
      
        const index_role = client.rolesPruebaRoleid;
        Role.findByPk(index_role).then(roles => {
        const authorities = "ROLE_" + roles.name.toUpperCase();
  
        req.session.token = token;
        res.status(200).send({
                            id: client.clientesPruebaIdCliente,
                            correo: client.correo,
                            zc1: client.zc,
                            zc1Pswd: client.zcPwd,
                            derivedKeyPswd: client.derivedKeyPwd,
                            ivPswd: client.ivPwd,
                            saltPrivada: client.saltPrivada,
                            ivUsuario: client.ivUsuario,
                            roles: authorities
                            });
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };
