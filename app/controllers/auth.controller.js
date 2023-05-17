const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Client = db.client;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
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


/*exports.registerUser = async (req, res) => {
  // Save User to User table
  try {
    const client = await Client.create({
      id_cliente: req.body.id_cliente,
      correo: req.body.correo,
      contrasena: bcrypt.hashSync(req.body.contrasena, 8)
    });

    res.status(200).send("Registro en users exitoso");

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};*/


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
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: client.clientesPruebaIdCliente }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      client.getRole().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        console.log(client.getRole())
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


/*exports.signin = async (req, res) => {

  try {
    const client = await Client.findOne({
      where: {
        correo: req.body.correo,
      },
    });

    const user = await User.findOne({
      where: {
        correo: req.body.correo,
      },
    });


    if (!client) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.contrasena,
      client.contrasena
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "¡Contraseña inválida!",
      });
    }

    const token = jwt.sign({ id: client.id_cliente}, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
  //let authorities = ['ROLE_USER'];
   req.session.token = token;

    return res.status(200).send({
      id: client.id_cliente,
      correo: client.correo,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};*/




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
