module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("clientes_prueba", {
    username: {
      type: Sequelize.STRING
    },
    nombre: {
      type: Sequelize.STRING
    },
    apellido_paterno: {
      type: Sequelize.STRING
    },
    apellido_materno: {
      type: Sequelize.STRING
    },
    genero: {
      type: Sequelize.STRING
    },
    correo: {
      type: Sequelize.STRING
    },
    telefono: {
      type: Sequelize.STRING
    },
    fecha_nacimiento: {
      type: Sequelize.STRING
    },
    contrasena: {
      type: Sequelize.STRING
    },
    ciudad: {
      type: Sequelize.STRING
    },
    estado: {
      type: Sequelize.STRING
    },
    codigo_postal: {
      type: Sequelize.STRING
    }
  },
  { timestamps: false }
  );

  return User;
};

