module.exports = (sequelize, Sequelize) => {
    const C_confianza = sequelize.define("c_confianza_prueba", {
      id_contacto_confianza: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
      },
      /*id_cliente: {
        type: Sequelize.INTEGER
      },*/
      nombre_contacto_confianza: {
        type: Sequelize.STRING
      },
      apellido_paterno_contacto_confianza: {
        type: Sequelize.STRING
      },
      apellido_materno_contacto_confianza: {
        type: Sequelize.STRING
      },
      relacion_cliente: {
        type: Sequelize.STRING
      },
      tel_contacto_confianza: {
        type: Sequelize.BIGINT
      },
      correo_contacto_confianza: {
        type: Sequelize.STRING
      }
    },
    { timestamps: false }
    );
  
    return C_confianza;
  };
  
  