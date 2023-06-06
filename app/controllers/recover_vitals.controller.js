const db = require("../models/index");
const Vitals = db.vitals;
const Client = db.client;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cryp = require("./cryp.controller")


exports.recover_user = async (req, res) => {

  const userid = req.params.userid;

  const old_vitals = await Vitals.findAll({ where: 
                                  { id_cliente: userid }})

  const client = await Client.findOne({where:
                                        { clientesPruebaIdCliente: userid,  
                                          rolesPruebaRoleid: 1 }});
                                    
  const contact = await Client.findOne({ where: 
                                        { clientesPruebaIdCliente: userid,  
                                          rolesPruebaRoleid: 4 }});
  
  saltClient = client.salt;  
  saltContact = client.salt;     

  pwdCliente = bcrypt.hashSync(req.body.pwdCliente, saltClient);
  pwdContacto = bcrypt.hashSync(req.body.pwdContacto, saltContact);
  preguntaCliente = bcrypt.hashSync(req.body.preguntaCliente, saltClient);
  preguntaContacto = bcrypt.hashSync(req.body.preguntaContacto, saltContact);

  saltPrivadaCliente = client.saltPrivada ;
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

  old_zc_client = client.zc;
  old_zcPwd_client = client.zcPwd;
  old_derivedKeyPwd_client = client.derivedKeyPwd;

  new_credentials = cryp.update_credentials(pwdCliente, pwdContacto, 
                                          preguntaCliente, preguntaContacto, 
                                          saltPrivadaCliente, saltPrivadaContacto, 
                                          ivCliente, ivContacto, 
                                          saltPwdCliente, saltPwdContacto, 
                                          ivPwdClienteCipher, ivPwdContactoCipher, 
                                          saltPreguntaCliente, saltPreguntaContacto, 
                                          ivPreguntaClienteCipher, ivPreguntaContactoCipher);
  
  console.log(new_credentials);

  new_keyPrivada_client = new_credentials.client_cryp[0];
  new_zc_client = new_credentials.client_cryp[1];
  new_derivedKeyPwd_client = new_credentials.client_cryp[2];
  new_zcPwd_client = new_credentials.client_cryp[3];
  new_derivedKeyPregunta_client = new_credentials.client_cryp[4];
  new_zcPregunta_client = new_credentials.client_cryp[5];
  
  new_keyPrivada_contact = new_credentials.contact_cryp[0];
  new_zc_contact = new_credentials.contact_cryp[1];
  new_derivedKeyPwd_contact = new_credentials.contact_cryp[2];
  new_zcPwd_contact = new_credentials.contact_cryp[3];
  new_derivedKeyPregunta_contact = new_credentials.contact_cryp[4];
  new_zcPregunta_contact = new_credentials.contact_cryp[5];


  const Z1_inverso = cryp.get_sharedSecret(old_zc_client, old_zcPwd_client, 
                                          old_derivedKeyPwd_client, ivPwdClienteCipher, 
                                          saltPrivadaCliente, ivCliente);

  const new_Z1_inverso = cryp.get_sharedSecret(new_zc_client, new_zcPwd_client, 
                                              new_derivedKeyPwd_client, ivPwdClienteCipher, 
                                              saltPrivadaCliente, ivCliente);                      

  for(const objeto in old_vitals){

        list = {ritmo_cardiaco: old_vitals[objeto].dataValues['ritmo_cardiaco'],
        recuencia_respiratoria: old_vitals[objeto].dataValues['frecuencia_respiratoria'],
        peso: old_vitals[objeto].dataValues['peso'],
        indice_masa_corporal: old_vitals[objeto].dataValues['indice_masa_corporal'],
        saturacion_oxigeno: old_vitals[objeto].dataValues['saturacion_oxigeno'],
        temperatura: old_vitals[objeto].dataValues['temperatura'],
        presion_sanguinea_sistolica: old_vitals[objeto].dataValues['presion_sanguinea_sistolica'],
        presion_sanguinea_diastolica: old_vitals[objeto].dataValues['presion_sanguinea_diastolica'],
        altura: old_vitals[objeto].dataValues['altura']}

        for(objeto_list in list){
          desencryp = cryp.desencriptarDato(Z1_inverso, ivCliente, list[objeto_list]);
          encryp = cryp.encriptarDato(new_Z1_inverso, ivCliente, desencryp);
          list[objeto_list] = encryp;
        }

        let prueba = list;
        old_vitals[objeto].update(prueba).then((self) => { });

  }

  let updateValuesClient = {zc: new_keyPrivada_client,
                            keyPrivada: new_zc_client,
                            derivedKeyPwd: new_derivedKeyPwd_client,
                            zcPwd: new_zcPwd_client,
                            derivedKeyPregunta: new_derivedKeyPregunta_client,
                            zcPregunta: new_zcPregunta_client};
  client.update(updateValuesClient).then((self) => {
                console.log(self);
  });

  let updateValuesContact = {zc: new_keyPrivada_contact,
                              keyPrivada: new_zc_contact,
                              derivedKeyPwd: new_derivedKeyPwd_contact,
                              zcPwd: new_zcPwd_contact,
                              derivedKeyPregunta: new_derivedKeyPregunta_contact,
                              zcPregunta: new_zcPregunta_contact};
  contact.update(updateValuesContact).then((self) => {
                console.log(self);
  });


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

  res.status(200).send({
    id: client.clientesPruebaIdCliente
    });



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
