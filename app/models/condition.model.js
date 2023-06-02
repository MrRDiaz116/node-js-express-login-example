module.exports = (sequelize, Sequelize) => {
    const Padecimiento = sequelize.define("padecimiento", {
      id_padecimiento: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      padecimiento: {
        type: Sequelize.INTEGER
      },
      desc_padecimiento: {
        type: Sequelize.INTEGER
      }
    },
    { timestamps: false });
  
    return Padecimiento;
  };
  