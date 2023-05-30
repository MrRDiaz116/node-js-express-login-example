const cryp = require("../controllers/cryp.controller");

zc = "5ede13f9845a94ef35aaf49c40f68f8c1877335a4f47a79e6c0664d7fb38d3272e1be2001bee61c33c17e6baa694d2c8";
zcPwd = "357f5f9ec4a159a7164d88e6e2ebb1d09b3c0be43ca2ced9eae081b653c847e81148a8c1f2c5fbf450b8df3e8930ad964e6447497f6feaa1fcbe015ae5845c24";
derivedKeyPwd = "915a13acd4a3056c8437e7ed992567aff0ca94fa60d00ae37407f4daa07568bc";
ivPwd = "84fc813e7256b97ece6f5373ae83d487";
saltPrivada = "c95bf85f1160f913399bc3f43f9fa75d";
ivUsuario = "5c7f4eabe7f1c2929f9233fa39ec75d3";

dato_encriptado = cryp.encriptarDato(zc, zcPwd,derivedKeyPwd,ivPwd,saltPrivada,ivUsuario, "1");
console.log(dato_encriptado);