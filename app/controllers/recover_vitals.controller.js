const db = require("../models/index");
const Vitals = db.vitals;
const Client = db.client;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cryp = require("./cryp.controller")


exports.recover_vitals = async (req, res) => {

  const userid = req.params.userid;

  const old_vitals = await Vitals.findAll({ where: 
                                  { id_cliente: userid }})

  const client = await Client.findOne({where:
                                        { clientesPruebaIdCliente: userid,  
                                          rolesPruebaRoleid: 1 }});
                                    
  const contact = await Client.findOne({ where: 
                                        { clientesPruebaIdCliente: userid,  
                                          rolesPruebaRoleid: 4 }});
  console.log(old_vitals);
  console.log(client.dataValues);
  console.log(contact);

  pwdCliente = req.body.new_pwd_cliente;
  pwdContacto = req.body.new_pwd_contacto;
  preguntaCliente = req.body.new_respuesta_seguridad_cliente;
  preguntaContacto = req.body.new_respuesta_seguridad_contacto;
  saltPrivadaCliente = client.saltPrivada;
  saltPrivadaContacto = contact.saltPrivada;
  ivCliente = client.ivUsuario;
  ivContacto = contact.ivUsuario;
  saltPwdCliente  = client.saltPwd;
  saltPwdContacto = contact.saltPwd;
  ivPwdClienteCipher = client.ivPwd;
  ivPwdContactoCipher = contact.ivPwd;
  saltPreguntaCliente = client.saltPregunta;
  saltPreguntaContacto = contact.saltPregunta;
  ivPreguntaClienteCipher = client.ivPregunta;
  ivPreguntaContactoCipher = contact.ivPregunta;

  old_keyPrivada_client = client.keyPrivada;
  old_keyPrivada_contact = contact.keyPrivada;
  old_zc_client = client.zc;
  old_zc_contact = contact.zc;
  old_zcPwd_client = client.zcPwd;
  old_zcPwd_contact = contact.zcPwd;
  old_derivedKeyPwd_client = client.derivedKeyPwd;
  old_derivedKeyPwd_client = contact.derivedKeyPwd;
  


  //pwdCliente, pwdContacto, preguntaCliente, preguntaContacto, saltPrivadaCliente, saltPrivadaContacto, ivCliente, ivContacto, saltPwdCliente, saltPwdContacto, ivPwdClienteCipher,  ivPwdContactoCipher, saltPreguntaCliente, saltPreguntaContacto, ivPreguntaClienteCipher,  ivPreguntaContactoCipher 
  /*pwdCliente,
  pwdContacto,
  preguntaCliente
  preguntaContacto
  saltPrivadaCliente
  saltPrivadaContacto
  ivCliente
  ivContacto
  saltPwdCliente 
  saltPwdContacto
  ivPwdClienteCipher
  ivPwdContactoCipher
  saltPreguntaCliente
  saltPreguntaContacto
  ivPreguntaClienteCipher
  ivPreguntaContactoCipher */

  /*salt
  saltPrivada
  ivUsuario
  saltPwd
  ivPwd
  saltPregunta
  ivPregunta*/

  /*attributes: ['salt',
                                                      'saltPrivada',
                                                      'ivUsuario',
                                                      'saltPwd',
                                                      'ivPwd',
                                                      'saltPregunta',
                                                      'ivPregunta',
                                                      'clientesPruebaIdCliente',
                                                      'rolesPruebaRoleid'],*/



  /*ritmo_cardiaco
  recuencia_respiratoria
  peso
  indice_masa_corporal
  saturacion_oxigeno
  temperatura
  presion_sanguinea_sistolica
  presion_sanguinea_diastolica
  altura*/



};



/*exports.createVitalsNormal = async (req, res) => {
  const id_sucursal_ = 3;
  const userid = req.params.userid;
  try {
    const vital_normal = await Vitals.create({
      id_cliente: userid,
      id_local: id_sucursal_,
      ritmo_cardiaco:cryp.encriptarDato(req.body.zc,
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
};*/
