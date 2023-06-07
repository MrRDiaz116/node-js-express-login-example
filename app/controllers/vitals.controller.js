const db = require("../models/index");
const Vitals = db.vitals;
const cryp = require("../controllers/cryp.controller");
const Client = db.client;

const util = require("node:util");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const decrypt = require("../controllers/decryp.controller");

exports.createVitalsNormal = async (req, res) => {
  const id_sucursal_ = 3;
  const userid = req.params.userid;

  const client = await Client.findOne({where:
    { clientesPruebaIdCliente: userid,  
      rolesPruebaRoleid: 1 }});

  zc = client.zc;
  zcPwd = client.zcPwd;
  derivedKeyPwd = client.derivedKeyPwd;
  ivPwd = client.ivPwd;
  saltPrivada = client.saltPrivada;
  ivUsuario = client.ivUsuario;

  Z1_inverso = decrypt.desencriptarSharedKey(zc, zcPwd, derivedKeyPwd, ivPwd, saltPrivada, ivUsuario);

  try {
    const vital_normal = await Vitals.create({
      id_cliente: userid,
      id_local: id_sucursal_,
        ritmo_cardiaco:cryp.encriptarDato(Z1_inverso,
                                          ivUsuario,
                                          req.body.ritmo_cardiaco),
        frecuencia_respiratoria: cryp.encriptarDato(Z1_inverso,
                                          ivUsuario,
                                          req.body.frecuencia_respiratoria),
        peso: cryp.encriptarDato(Z1_inverso,
                                ivUsuario,
                                req.body.peso),
        indice_masa_corporal: cryp.encriptarDato(Z1_inverso,
                                      ivUsuario, 
                                      req.body.indice_masa_corporal),
        saturacion_oxigeno: cryp.encriptarDato(Z1_inverso,
                        ivUsuario, 
                        req.body.saturacion_oxigeno),
        temperatura: cryp.encriptarDato(Z1_inverso,
                        ivUsuario, 
                        req.body.temperatura),
        presion_sanguinea_sistolica: cryp.encriptarDato(Z1_inverso,
                        ivUsuario,
                        req.body.presion_sanguinea_sistolica),
        presion_sanguinea_diastolica: cryp.encriptarDato(Z1_inverso,
                        ivUsuario,
                        req.body.presion_sanguinea_diastolica),
        altura: cryp.encriptarDato(Z1_inverso,
                        ivUsuario,
                        req.body.altura),
    });
    

    res.send(vital_normal);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Sucedió un error al localizar los datos.",
    });
  }
};
