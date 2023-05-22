const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Client = db.client;
const Role = db.role;
const list = db.ROLES;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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

    const client = await Client.create({
      correo: req.body.correo,
      contrasena: bcrypt.hashSync(req.body.contrasena, 8),
      clientesPruebaIdCliente:user.id_cliente
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

      
      console.log("AQUÍ ES");
      console.log(client.rolesPruebaRoleid);
    
      const index_role = client.rolesPruebaRoleid;
      Role.findByPk(index_role).then(roles => {
        const authorities = "ROLE_" + roles.name.toUpperCase();
        User.findByPk(client.clientesPruebaIdCliente).then(usuario => {

                  req.session.token = token;
                  
                  res.status(200).send({
                    id: client.clientesPruebaIdCliente,
                    nombre: usuario.nombre,
                    correo: client.correo,
                    roles: authorities
                  });
              });
         });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};