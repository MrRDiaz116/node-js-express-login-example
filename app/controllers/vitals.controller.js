const db = require("../models/index");
const Vitals = db.vitals;
const cryp = require("../controllers/cryp.controller")

const util = require("node:util");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createVitalsNormal = async (req, res) => {
  const id_sucursal_ = 3;
  const userid = req.params.userid;
  try {
    const vital_normal = await Vitals.create({
      id_cliente: userid,
      id_local: id_sucursal_,
      ritmo_cardiaco: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.ritmo_cardiaco),
      frecuencia_respiratoria: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.frecuencia_respiratoria),
      peso: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario,req.body.peso),
      indice_masa_corporal: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.indice_masa_corporal),
      saturacion_oxigeno: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.saturacion_oxigeno),
      temperatura: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.temperatura),
      presion_sanguinea_sistolica: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.presion_sanguinea_sistolica),
      presion_sanguinea_diastolica: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.presion_sanguinea_diastolica),
      altura: cryp.encriptarDato(req.body.zc,
        req.body.zcPwd,
        req.body.derivedKeyPwd,
        req.body.ivPwd,
        req.body.saltPrivada,
        req.body.ivUsuario, req.body.altura),
    });

    res.send(vital_normal);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Sucedió un error al localizar los datos.",
    });
  }
};
