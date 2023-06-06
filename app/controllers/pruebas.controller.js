const cryp = require("../controllers/cryp.controller");
const decrypt = require("../controllers/decryp.controller");

zc = "c59380db66536efe30061042576f1557655579444d1e6cd7df3b6fe57e03e008";
zcPwd = "573b1eaee71f7cd24654a66ce7c17758f8901d3026d198708740bcd9349f5ce199cd562750ab7bc6ffbcf9d13e6a84ad91cf5865739c6b56fbf1e45f3da148dc";
derivedKeyPwd = "e7ea18ee6fd0ae27ce7cd94d42cf8062b62bb9c9cac4ec7521248c75ca7b15df";
ivPwd = "db37327738641752460343b0c4b2e09a";
saltPrivada = "aee1579d9a3846d1077804dc26dc9545";
ivUsuario = "381f41ddee199e7c5108956b262c857d";
dato_encriptado = "b0063c807b45a08ae9ff0e23f513bdc5";


Z1_inverso = decrypt.desencriptarSharedKey(zc, zcPwd, derivedKeyPwd, ivPwd, saltPrivada, ivUsuario);
dato_encriptado = cryp.desencriptarDato(Z1_inverso, ivUsuario, dato_encriptado);
console.log(dato_encriptado);

