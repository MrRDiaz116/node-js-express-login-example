const db_normal = require("../models copy");
const VitalsNormal = db_normal.vitals_normal;

const util = require("node:util");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createVitalsNormal = async (req, res) => {
  const id_sucursal_ = 3;

  try {
    const vital_normal = await VitalsNormal.create({
      id_sucursal: id_sucursal_,
      ritmo_cardiaco: req.body.ritmo_cardiaco,
      frecuencia_respiratoria: req.body.frecuencia_respiratoria,
      peso: req.body.peso,
      indice_masa_corporal: req.body.indice_masa_corporal,
      saturacion_oxigeno: req.body.saturacion_oxigeno,
      temperatura: req.body.temperatura,
      presion_sanguinea_sistolica: req.body.presion_sanguinea_sistolica,
      presion_sanguinea_diastolica: req.body.presion_sanguinea_diastolica,
      altura: req.body.altura,
    });

    res.send(vital_normal);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Sucedió un error al localizar los datos.",
    });
  }
};
