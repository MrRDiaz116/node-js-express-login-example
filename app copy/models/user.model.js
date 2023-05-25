module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define("clientes_pruebas", {
    id_cliente: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
      type: Sequelize.BIGINT
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
      type: Sequelize.INTEGER
    },
    a_nacimiento: {
      type: Sequelize.INTEGER
    },
    respuesta_seguridad: {
      type: Sequelize.STRING
    },
    placeholder: {
      type: Sequelize.STRING
    },
  },
  { timestamps: false }
  );

  return Client;
};
