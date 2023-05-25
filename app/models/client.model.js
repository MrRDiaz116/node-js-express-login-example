module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users_pruebas", {
      userid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      correo: {
        type: Sequelize.STRING
      },
      contrasena: {
        type: Sequelize.STRING
      },
      llave_comp: {
        type: Sequelize.STRING
      },
      llave_priv: {
        type: Sequelize.STRING
      },
      saltPrivada: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      iv: {
        type: Sequelize.STRING
      },
      zc: {
        type: Sequelize.STRING
      },
      saltPwd: {
        type: Sequelize.STRING
      },
      derivedKeyEmail: {
        type: Sequelize.STRING
      },
      ivEmail: {
        type: Sequelize.STRING
      },
      zcEmail: {
        type: Sequelize.STRING
      },
      saltPregunta: {
        type: Sequelize.STRING
      },
      derivedKeyPregunta: {
        type: Sequelize.STRING
      },
      ivPregunta: {
        type: Sequelize.STRING
      },
      zcPregunta: {
        type: Sequelize.STRING
      },
      rolePregunta: {
        type: Sequelize.STRING
      },
      pregunta_seguridad: {
        type: Sequelize.STRING
      },
      
    },
    { timestamps: false }
    );
  
    return User;
  };
  
  