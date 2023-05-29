const crypto = require('crypto');
const decrypt = require("../controllers/decryp.controller")
module.exports ={ 

    encriptarDato: function(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario, dato) {
        
        const formato = 'hex'
        // Transformación a Buffer
        derivedKeyMetodo = Buffer.from(derivedKeyMetodo, formato);
        ivMetodo = Buffer.from(ivMetodo, formato);
        saltPrivada = Buffer.from(saltPrivada, formato);
        ivUsuario = Buffer.from(ivUsuario, formato);
    
        // Se desencripta el secreto compartido
        Z1_inverso = decrypt.desencriptarSharedKey(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario)
    
        // Creación del cifrador 
        const cipherDato = crypto.createCipheriv('aes-256-cbc', Z1_inverso, ivUsuario);
        cipherDato.setAutoPadding(true);
        // Encriptación del valor con la clave derivada del secreto compartido y el vector de inicialización del usuario
        const DatoCifrado = cipherDato.update(dato, 'utf8', formato) + cipherDato.final(formato);
        return DatoCifrado;
    }


}