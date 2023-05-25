const db = require("../models");
const config = require("../config/auth.config");
const cryp = require("../controllers/cryp.controller")
const User = db.user;
const Client = db.client;
const Role = db.role;
const Contact = db.contact

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

exports.signup = async (req, res) => {
  try {

    const user = await User.create({
      nombre: req.body.nombre,
      apellido_paterno: req.body.apellido_paterno,
      apellido_materno: req.body.apellido_materno,
      genero: req.body.genero,
      correo: req.body.correo,
      telefono: req.body.telefono,
      contrasena: bcrypt.hashSync(req.body.contrasena, 8),
      ciudad: req.body.ciudad,
      estado: req.body.estado,
      codigo_postal: req.body.codigo_postal,
      a_nacimiento: req.body.a_nacimiento,
      respuesta_seguridad: req.body.respuesta_seguridad
    });

    const contact = await Contact.create({
      nombre_contacto_confianza: req.body.nombre_contacto_confianza,
      apellido_paterno_contacto_confianza: req.body.apellido_paterno_contacto_confianza,
      apellido_materno_contacto_confianza: req.body.apellido_materno_contacto_confianza,
      relacion_cliente: req.body.relacion_cliente,
      tel_contacto_confianza: req.body.tel_contacto_confianza,
      correo_contacto_confianza: req.body.correo_contacto_confianza,
      contrasena_contacto_confianza: bcrypt.hashSync(req.body.contrasena_contacto_confianza, 8)
    });

    var parametros = cryp.rutina_registro(user.contrasena,contact.contrasena_contacto_confianza, 
      user.correo, contact.correo_contacto_confianza, 
      user.respuesta_seguridad, "adios");

    const client = await Client.create({
      correo: req.body.correo,
      contrasena: bcrypt.hashSync(req.body.contrasena, 8),
      llave_comp: parametros.client_cryp[0],
      llave_priv: parametros.client_cryp[1],
      saltPrivada: parametros.client_cryp[2],
      key: parametros.client_cryp[3],
      iv: parametros.client_cryp[4],
      zc: parametros.client_cryp[5],
      saltPwd: parametros.client_cryp[6],
      derivedKeyEmail: parametros.client_cryp[7],
      ivEmail:parametros.client_cryp[8],
      zcEmail:parametros.client_cryp[9],
      saltPregunta:parametros.client_cryp[10],
      derivedKeyPregunta:parametros.client_cryp[11],
      ivPregunta: parametros.client_cryp[12],
      zcPregunta: parametros.client_cryp[13],
      rolePregunta: parametros.client_cryp[14],
      pregunta_seguridad: parametros.client_cryp[15],
      clientesPruebaIdCliente:user.id_cliente,
      cConfianzaPruebaIdContactoConfianza: contact.id_contacto_confianza
    });

    const client_contact = await Client.create({
      correo: contact.correo_contacto_confianza,
      contrasena: bcrypt.hashSync(contact.contrasena_contacto_confianza, 8),
      llave_comp: parametros.contact_cryp[0],
      llave_priv: parametros.contact_cryp[1],
      saltPrivada: parametros.contact_cryp[2],
      key: parametros.contact_cryp[3],
      iv: parametros.contact_cryp[4],
      zc: parametros.contact_cryp[5],
      saltPwd: parametros.contact_cryp[6],
      derivedKeyEmail: parametros.contact_cryp[7],
      ivEmail:parametros.contact_cryp[8],
      zcEmail:parametros.contact_cryp[9],
      saltPregunta:parametros.contact_cryp[10],
      derivedKeyPregunta:parametros.contact_cryp[11],
      ivPregunta: parametros.contact_cryp[12],
      zcPregunta: parametros.contact_cryp[13],
      rolePregunta: parametros.contact_cryp[14],
      pregunta_seguridad: parametros.contact_cryp[15],
      clientesPruebaIdCliente:user.id_cliente,
      cConfianzaPruebaIdContactoConfianza: contact.id_contacto_confianza,
      rolesPruebaRoleid: [1]
    });


    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = client.setRole(roles);
      if (result) res.send({ message: "¡Registro exitoso!" });
    } else {
      // user has role = 1
      const result = client.setRole([1]);
      if (result) res.send({ message: "¡Registro exitoso!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = (req, res) => {
  Client.findOne({
    where: {
      correo: req.body.correo
    }
  })
    .then(client => {
      if (!client) {
        return res.status(404).send({ message: "No se encontró al usuario." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.contrasena,
        client.contrasena
      );

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
                          roles: authorities
                          });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "Se cerró sesión."
    });
  } catch (err) {
    this.next(err);
  }
};
