import * as crypto from 'crypto'

const forge = require('node-forge');

export const EncryptedHelpers = {
  generateKeys,
}

async function generateKeys(phrase: string) {
  // randomly generate a salt and hash the phrase
  const salt = crypto.randomBytes(16).toString('base64')
    , hashPhrase = crypto.createHmac("sha256", salt).update(phrase).digest("base64").toString()
    , keys = { salt: salt, public_key: '', en_private_key: '' };

  console.log(window.crypto.subtle)

  const {publicKey, privateKey}= await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );

  // export the crypto key to pkcs8 format in pem, and encrypt the private key to pem
  const pki = forge.pki;
  const privateKey_exported = await window.crypto.subtle.exportKey('pkcs8', privateKey)
    , publicKey_exported = await window.crypto.subtle.exportKey("spki", publicKey)
    , privateKey_pem = exportCryptoKeyToPem(privateKey_exported, false)
    , privateKey_forge = pki.privateKeyFromPem(privateKey_pem); // convert pem to forge

  keys.public_key = exportCryptoKeyToPem(publicKey_exported, true)
  keys.en_private_key = pki.encryptRsaPrivateKey(privateKey_forge, hashPhrase);

  return keys
}

function exportCryptoKeyToPem(exported:ArrayBuffer, isPublic:boolean) {
  let exportedAsString = ''
  const bytes = new Uint8Array(exported)
  for (var i = 0; i < bytes.byteLength; i++) {
    exportedAsString += String.fromCharCode(bytes[i]);
  }
  const exportedAsBase64 = window.btoa(exportedAsString);

  if(isPublic) {
    return  `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`
  } else {
    return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
  }
}




// function encryptData(phrase,publicKey) {
//   var data = ''
//     , encryptedData= CryptoJS.AES.encrypt(data, phrase)
//     , entryKey = encrypted.key
//     , encryptedEntryKey = encryptEntryKey(entryKey,publicKey);
//
//   res['EN_entryKey'] = encryptedEntryKey;
//   res['data'] = encryptedData;
// }

// function decryptKey(phrase,encrypted) {
//   //get the salt, keypair from DB
//   var hashStr = CryptoJS.SHA256(phrase, salt).toString(CryptoJS.enc.Base64)
//     , hashStrDB = '';
//   //compare the hash within the DB
//   if(hashStr === hashStrDB) { // return the decrypted private key
//     return CryptoJS.AES.decrypt(encrypted, hashStr);
//   } else {
//     // the phrase is wrong
//   }
// }

// function decryptData(phrase, key) {
//   var encrypted = ''
//   if(phrase != null) {
//      return decryptKey(phrase)
//   } else { //find the key in the localstorage
//     return CryptoJS.AES.decrypt(encrypted, key);
//   }
//
// }
