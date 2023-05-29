module.exports = (sequelize, Sequelize) => {
  const VitalsNormal = sequelize.define("vital_prueba", {
    id_lectura: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_cliente: {
      type: Sequelize.INTEGER
    },
    id_local: {
      type: Sequelize.INTEGER
    },
    ritmo_cardiaco: {
      type: Sequelize.STRING
    },
    frecuencia_respiratoria: {
      type: Sequelize.STRING
    },
    peso: {
      type: Sequelize.STRING
    },
    indice_masa_corporal: {
      type: Sequelize.STRING
    },
    saturacion_oxigeno: {
      type: Sequelize.STRING
    },
    temperatura: {
      type: Sequelize.STRING
    },
    presion_sanguinea_sistolica: {
      type: Sequelize.STRING
    },
    presion_sanguinea_diastolica: {
      type: Sequelize.STRING
    },
    altura: {
      type: Sequelize.STRING
    },
    date_time: {
      type: Sequelize.DATE
    }
  },
  { timestamps: false }
  );

  return VitalsNormal;
};