import * as crypto from 'crypto'

export const EncryptedHelpers = {
  generateHash,
}

function generateHash(phrase:string) {
  // randomly generate a salt and hash the phrase
  const salt = crypto.randomBytes(16).toString('base64')
    , hash = crypto.createHmac("sha256",salt).update(phrase).digest("base64").toString()
    , keys = {salt: salt, hash:hash};
  return keys
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
