const crypto = require('crypto');
module.exports ={ 
    desencriptarSharedKey: function(ZC1, ZC1Metodo, derivedKeyMetodo, ivMetodo, saltPrivada, ivUsuario){
        // Parametros utilizados para la generación de llaves derivadas
        const iterations = 480000;
        const length2 = 32;
        const algorithm = 'sha256';
        const formato = 'hex'
    
        // Transformación a Buffer
        derivedKeyMetodo = Buffer.from(derivedKeyMetodo, formato);
        ivMetodo = Buffer.from(ivMetodo, formato);
        saltPrivada = Buffer.from(saltPrivada, formato);
        ivUsuario = Buffer.from(ivUsuario, formato);

        //ZC1 = Buffer.from(ZC1, formato);
        // Decriptador de la llave privada del usuario
        const descifradorPrivateKey = crypto.createDecipheriv('aes-256-cbc', derivedKeyMetodo, ivMetodo); // Se genera el desencriptador para el correo del cliente
        // Aqui se desencripta la llave privada del cliente con el cifrador
        const Z1 = descifradorPrivateKey.update(ZC1Metodo, formato, formato) + descifradorPrivateKey.final(formato); 
        // Con la llave privada del cliente obtenemos la clave derivada
        const keyDerivada_inverso = crypto.pbkdf2Sync(Z1, saltPrivada, iterations, length2, algorithm);
        // Se obtiene el decriptador del secreto compartido
        const descifradorMetodo_inverso = crypto.createDecipheriv('aes-256-cbc', keyDerivada_inverso, ivUsuario);
        // Se desencripta el secreto compartido
        const Z1_inverso = descifradorMetodo_inverso.update(ZC1, formato, formato) + descifradorMetodo_inverso.final(formato);
        return Buffer.from(Z1_inverso, formato);
    }

}