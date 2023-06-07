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

  const formato = 'hex';   
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

  old_keyPrivada_client = client.keyPrivada;
  old_keyPrivada_contact = contact.keyPrivada;
  old_zc_client = client.zc;
  old_zc_contact = contact.zc;
  old_zcPwd_client = client.zcPwd;
  old_zcPwd_contact = contact.zcPwd;
  old_derivedKeyPwd_client = client.derivedKeyPwd;
  old_derivedKeyPwd_contact = contact.derivedKeyPwd;

  new_credentials = cryp.update_credentials(pwdCliente, pwdContacto, preguntaCliente, preguntaContacto, saltPrivadaCliente, saltPrivadaContacto, ivCliente, ivContacto, saltPwdCliente, saltPwdContacto, ivPwdClienteCipher,  ivPwdContactoCipher, saltPreguntaCliente, saltPreguntaContacto, ivPreguntaClienteCipher,  ivPreguntaContactoCipher);

  new_keyPrivada_client = new_credentials.client_cryp[0];
  new_keyPrivada_contact = new_credentials.contact_cryp[0];
  new_zc_client = new_credentials.client_cryp[1];
  new_zc_contact = new_credentials.contact_cryp[1];
  new_derivedKeyPwd_client = new_credentials.client_cryp[2];
  new_derivedKeyPwd_contact = new_credentials.contact_cryp[2];
  new_zcPwd_client = new_credentials.client_cryp[3];
  new_zcPwd_contact = new_credentials.contact_cryp[3];
  new_derivedKeyPregunta_client = new_credentials.client_cryp[4];
  new_derivedKeyPregunta_contact = new_credentials.contact_cryp[4];
  new_zcPregunta_client = new_credentials.client_cryp[5];
  new_zcPregunta_contact = new_credentials.contact_cryp[5];


  const Z1_inverso = cryp.get_sharedSecret(old_zc_client, old_zcPwd_client, old_derivedKeyPwd_client, ivPwdClienteCipher, saltPrivadaCliente, ivCliente);
  const new_Z1_inverso = cryp.get_sharedSecret(new_zc_client, new_zcPwd_client, new_derivedKeyPwd_client, ivPwdClienteCipher, saltPrivadaCliente, ivCliente);

  for(const objeto in old_vitals){

        list = {ritmo_cardiaco: old_vitals[objeto].dataValues['ritmo_cardiaco'],
        frecuencia_respiratoria: old_vitals[objeto].dataValues['frecuencia_respiratoria'],
        peso: old_vitals[objeto].dataValues['peso'],
        indice_masa_corporal: old_vitals[objeto].dataValues['indice_masa_corporal'],
        saturacion_oxigeno: old_vitals[objeto].dataValues['saturacion_oxigeno'],
        temperatura: old_vitals[objeto].dataValues['temperatura'],
        presion_sanguinea_sistolica: old_vitals[objeto].dataValues['presion_sanguinea_sistolica'],
        presion_sanguinea_diastolica: old_vitals[objeto].dataValues['presion_sanguinea_diastolica'],
        altura: old_vitals[objeto].dataValues['altura']}

        let list_resultados = {ritmo_cardiaco: "",
                          frecuencia_respiratoria: "",
                          peso: "",
                          indice_masa_corporal: "",
                          saturacion_oxigeno: "",
                          temperatura: "",
                          presion_sanguinea_sistolica: "",
                          presion_sanguinea_diastolica: "",
                          altura:""}

        

        for(objeto_list in list){
          desencryp = cryp.desencriptarDato(Z1_inverso, ivCliente, list[objeto_list]);
          encryp = cryp.encriptarDato(new_Z1_inverso, ivCliente, desencryp);
          desencryp = cryp.desencriptarDato(new_Z1_inverso, ivCliente, encryp);
          list_resultados[objeto_list] = encryp;
        };

        old_vitals[objeto].update(list_resultados).then((self) => {console.log("Datos actualizados existosamente.") });

  }

  let updateValuesClient = {zc: new_zc_client,
                            keyPrivada: new_keyPrivada_client,
                            derivedKeyPwd: new_derivedKeyPwd_client,
                            zcPwd: new_zcPwd_client,
                            derivedKeyPregunta: new_derivedKeyPregunta_client,
                            zcPregunta: new_zcPregunta_client};
  client.update(updateValuesClient).then((self) => {
                console.log("¡Usuario actualizado existosamente!");
  });

  let updateValuesContact = {zc: new_zc_contact,
                              keyPrivada: new_keyPrivada_contact,
                              derivedKeyPwd: new_derivedKeyPwd_contact,
                              zcPwd: new_zcPwd_contact,
                              derivedKeyPregunta: new_derivedKeyPregunta_contact,
                              zcPregunta: new_zcPregunta_contact};
  contact.update(updateValuesContact).then((self) => { 
                console.log("¡Contacto actualizado existosamente!");
   });

};