const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Vitals = db.vitals;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const user = await User.create({
      username: req.body.username,
      nombre: req.body.nombre,
      apellido_paterno: req.body.apellido_paterno,
      apellido_materno: req.body.apellido_materno,
      genero: req.body.genero,
      correo: req.body.correo,
      telefono: req.body.telefono,
      fecha_nacimiento: req.body.fecha_nacimiento,
      contrasena: bcrypt.hashSync(req.body.contrasena, 8),
      ciudad: req.body.ciudad,
      estado: req.body.estado,
      codigo_postal: req.body.codigo_postal
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({ message: "¡Registro exitoso!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.send({ message: "¡Registro exitoso!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};






exports.signin = async (req, res) => {

  try {

    console.log(req.body.correo)
    const user = await User.findOne({
      where: {
        correo: req.body.correo,
      },
    });


    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.contrasena,
      user.contrasena
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "¡Contraseña inválida!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

   req.session.token = token;

    return res.status(200).send({
      id: user.id,
      username: user.username,
      correo: user.correo,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
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
