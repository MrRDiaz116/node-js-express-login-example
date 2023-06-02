const db = require("../models");
const config = require("../config/auth.config");
const cryp = require("../controllers/cryp.controller")
const User = db.user;
const Client = db.client;
const Role = db.role;
const Contact = db.contact;
const Condition = db.condition;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

exports.signup = async (req, res) => {
  try {
    const saltClient = await bcrypt.genSalt(16);
    const saltContact = await bcrypt.genSalt(16);

    const user = await User.create({
      nombre: req.body.nombre,
      apellido_paterno: req.body.apellido_paterno,
      apellido_materno: req.body.apellido_materno,
      genero: req.body.genero,
      correo: req.body.correo,
      telefono: req.body.telefono,
      ciudad: req.body.ciudad,
      estado: req.body.estado,
      codigo_postal: req.body.codigo_postal,
      a_nacimiento: req.body.a_nacimiento,
      pregunta_seguridad: req.body.pregunta_seguridad,
      respuesta_seguridad: req.body.respuesta_seguridad
    });

    const contact = await Contact.create({
      nombre_contacto_confianza: req.body.nombre_contacto_confianza,
      apellido_paterno_contacto_confianza: req.body.apellido_paterno_contacto_confianza,
      apellido_materno_contacto_confianza: req.body.apellido_materno_contacto_confianza,
      tel_contacto_confianza: req.body.tel_contacto_confianza,
      correo_contacto_confianza: req.body.correo_contacto_confianza,
    });

    
    contrasena = bcrypt.hashSync(req.body.contrasena, saltClient);
    contrasena_contact = bcrypt.hashSync(req.body.contrasena_contacto_confianza, saltContact);

    var parametros = cryp.rutina_registro(contrasena, contrasena_contact,
      user.correo, contact.correo_contacto_confianza, 
      user.respuesta_seguridad, "adios");

    const client = await Client.create({
      correo: req.body.correo,
      contrasena: contrasena,
      salt: saltClient,
      saltPrivada: parametros.client_cryp[0],
      keyPrivada: parametros.client_cryp[1],
      ivUsuario: parametros.client_cryp[2],
      zc: parametros.client_cryp[3],
      saltPwd: parametros.client_cryp[4],
      derivedKeyPwd: parametros.client_cryp[5],
      ivPwd: parametros.client_cryp[6],
      zcPwd: parametros.client_cryp[7],
      saltEmail:parametros.client_cryp[8],
      derivedKeyEmail:parametros.client_cryp[9],
      ivEmail:parametros.client_cryp[10],
      zcEmail:parametros.client_cryp[11],
      saltPregunta: parametros.client_cryp[12],
      derivedKeyPregunta: parametros.client_cryp[13],
      ivPregunta: parametros.client_cryp[14],
      zcPregunta: parametros.client_cryp[15],
      clientesPruebaIdCliente:user.id_cliente,
      cConfianzaPruebaIdContactoConfianza: contact.id_contacto_confianza
    });

    const client_contact = await Client.create({
      correo: contact.correo_contacto_confianza,
      salt: saltContact,
      contrasena: contrasena_contact,
      saltPrivada: parametros.contact_cryp[0],
      keyPrivada: parametros.contact_cryp[1],
      ivUsuario: parametros.contact_cryp[2],
      zc: parametros.contact_cryp[3],
      saltPwd: parametros.contact_cryp[4],
      derivedKeyPwd: parametros.contact_cryp[5],
      ivPwd: parametros.contact_cryp[6],
      zcPwd: parametros.contact_cryp[7],
      saltEmail:parametros.contact_cryp[8],
      derivedKeyEmail:parametros.contact_cryp[9],
      ivEmail:parametros.contact_cryp[10],
      zcEmail:parametros.contact_cryp[11],
      saltPregunta: parametros.contact_cryp[12],
      derivedKeyPregunta: parametros.contact_cryp[13],
      ivPregunta: parametros.contact_cryp[14],
      zcPregunta: parametros.contact_cryp[15],
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
            message: "¡Respuesta inválida!"
          });
        }
        var token = jwt.sign({ id: client.userid }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
      
        const index_role = client.rolesPruebaRoleid;
        const index_user = client.clientesPruebaIdCliente;
        User.findByPk(index_user).then(user => {
        req.session.token = token;

        user.getPadecimientos().then(value => { 

          res.status(200).send({
                              id: client.clientesPruebaIdCliente,
                              correo: client.correo,
                              zc1: client.zc,
                              zc1Pswd: client.zcPwd,
                              derivedKeyPswd: client.derivedKeyPwd,
                              ivPswd: client.ivPwd,
                              saltPrivada: client.saltPrivada,
                              ivUsuario: client.ivUsuario,
                              nombre: user.nombre,
                              genero: user.genero,
                              diagnostico: value[0].dataValues.id_padecimiento
                              });
          
          })
          });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };

  exports.restore_pwd = (req, res) => {
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
        const saltPreguntaCliente = Buffer.from(client.saltPregunta,formato);
        const iterations = 480000;
        const length2 = 32;
        const algorithm = 'sha256';
        const originalPregunta = client.derivedKeyPregunta;
        const bodyResponse = bcrypt.hashSync(req.body.pregunta_seguridad, salt);
  
        const derivedKeyPwdCliente = crypto.pbkdf2Sync(bodyResponse, saltPreguntaCliente, iterations, length2, algorithm);
        const comparisionPassword = derivedKeyPwdCliente.toString('hex');

        var responseIsValid = originalPregunta == comparisionPassword;
  
        if (!responseIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "¡Contraseña inválida!"
          });
        }
        var token = jwt.sign({ id: client.userid }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
      
        const index_role = client.rolesPruebaRoleid;
        const index_user = client.clientesPruebaIdCliente;
        Role.findByPk(index_role).then(roles => {
          User.findByPk(index_user).then(user => {
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
                              nombre: user.nombre,
                              genero: user.genero
                              });
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
