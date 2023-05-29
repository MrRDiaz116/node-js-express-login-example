module.exports = (sequelize, Sequelize) => {
  const Vitals = sequelize.define("vital_prueba", {
    id_lectura: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_hash: {
      type: Sequelize.STRING
    },
    id_sucursal: {
      type: Sequelize.INTEGER
    },
    ritmo_cardiaco: {
      type: Sequelize.INTEGER
    },
    frecuencia_respiratoria: {
      type: Sequelize.INTEGER
    },
    peso: {
      type: Sequelize.FLOAT
    },
    indice_masa_corporal: {
      type: Sequelize.FLOAT
    },
    saturacion_oxigeno: {
      type: Sequelize.INTEGER
    },
    temperatura: {
      type: Sequelize.FLOAT
    },
    presion_sanguinea_sistolica: {
      type: Sequelize.INTEGER
    },
    presion_sanguinea_diastolica: {
      type: Sequelize.INTEGER
    },
    altura: {
      type: Sequelize.FLOAT
    },
    date_time: {
      type: Sequelize.DATE
    }
  },
  { timestamps: false }
  );

  return Vitals;
};
