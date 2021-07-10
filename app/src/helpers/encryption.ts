import * as crypto from 'crypto'

const forge = require('node-forge')
  ,  pki = forge.pki;

export const EncryptedHelpers = {
  generateKeys,
}

async function generateKeys(phrase: string) {
  // randomly generate a salt and hash the phrase
  const salt = crypto.randomBytes(16).toString('base64')
    , hashPhrase = crypto.createHmac("sha256", salt).update(phrase).digest("base64").toString()
    , keys = { salt: salt, public_key: '', en_private_key: '' };

  console.log('hashPhrase', hashPhrase)

  const {publicKey, privateKey} = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },
    true,
    ["encrypt", "decrypt"]
  );

  // export the crypto key to pkcs8 format in pem
  const privateKey_exported = await window.crypto.subtle.exportKey('pkcs8', privateKey);
  const publicKey_exported = await window.crypto.subtle.exportKey("spki", publicKey);
  const privateKey_pkcs8 = exportCryptoKeyToPKCS(privateKey_exported, false);

  keys.public_key = exportCryptoKeyToPKCS(publicKey_exported, true)

  // encrypt the private key to pem format
  const privateKey_forge = pki.privateKeyFromPem(privateKey_pkcs8);
  keys.en_private_key = pki.encryptRsaPrivateKey(privateKey_forge, hashPhrase);
  return keys
}

function exportCryptoKeyToPKCS(exported:ArrayBuffer, isPublic:boolean) {
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

function decryptEncryptedPrivateKey(en_private_key:string, phrase:string, salt:string) {
  const hashPhrase = crypto.createHmac("sha256", salt).update(phrase).digest("base64").toString();
  // decrypt the private key in the pem format
  const privateKey = pki.decryptRsaPrivateKey(en_private_key, hashPhrase);
  return privateKey
}


// function decryptEncryptedEntryKey(private_key:string,en_entry_key:string) {
//   en_entry_key = 'rLnY6WUP0TMent5PV+V4hiRu4dYP3Tn0jU5ysROS+JH1d2ELnu7L5yIMa6Em9aan3jm/S+Dryr98/48iVXDLQ0o0V9gHAGubJp/mfq4S6fYpYf/1UVWMuxQGmLVVAjZRSg9wpVOz4c3FajOe7HU3JjF8DB1qJ1VlRP6FDlTzBtgL6k92b1aDrpb71PXqZWmlhU0O+E2wF9fxMQMrWkix3ZZzc3URbky/a1K/z8IuxlPZ5BcKMFuarbnh5qY9uKA6YaAxI8LCkZ96uE2R6HcnrTDZkWe6T5tzLBMLv1LHkFQkxbGlimfOVcufcMQVzTTNqiSuS5X3Uzq/gEsiTaj02Q=='
//
//
//   return window.crypto.subtle.decrypt(
//     {
//       name: "RSA-OAEP"
//     },
//     private_key,
//     ciphertext
//   );
// }




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
