const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Client = db.client;


verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "¡No se porporcionó un token!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "No autorizado!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

/*isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Se requiere rol de admin!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "No se puede validar el rol de admin!",
    });
  }
};*/

isAdmin = (req, res, next) => {
  Client.findByPk(req.userId).then(client => {
    client.getRole().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "¡Se requiere rol de Administrador!"
      });
      return;
    });
  });
};

/*isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Se requiere rol de moderator!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "No se puede validar el rol de moderator!",
    });
  }
};*/

isModerator = (req, res, next) => {
  Client.findByPk(req.userId).then(client => {
    client.getRole().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "¡Se requiere rol de moderador!"
      });
    });
  });
};

/*isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Se requiere rol de moderator o de admin!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "No se puede validar el rol de moderator o de admin!",
    });
  }
};*/

isModeratorOrAdmin = (req, res, next) => {
  Client.findByPk(req.userId).then(client => {
    client.getRole().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "¡Se requiere rol de moderador o administrador!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
