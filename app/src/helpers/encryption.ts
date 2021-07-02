export const encryptedHelpers = {
  generateEncryptedKeys,
  saveKeys,
  generateEncryptedEntryKey
}

const CryptoJS = require('crypto-js') , crypto = require('crypto')

function generateEncryptedKeys(phrase:string) {
  // randomly generate a salt and hash the phrase
  const salt = CryptoJS.lib.WordArray.random(128/8).toString()
    , hash = CryptoJS.SHA256(phrase, salt)
    , hashStr = hash.toString(CryptoJS.enc.Base64) // stringify the hash
    , keys = {salt: salt, public_key:'', en_private_key:''}
    , prime_length = 60
    , diffHell = crypto.createDiffieHellman(prime_length);

  diffHell.generateKeys('base64');
  keys.public_key = diffHell.getPublicKey('base64');
  keys.en_private_key = CryptoJS.AES.encrypt(diffHell.getPrivateKey('base64'), hashStr).ciphertext.toString()
  return keys
  // generate a public private key pair
  // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  //   modulusLength: 1024,
  //   publicKeyEncoding: {
  //     type: 'spki',
  //     format: 'pem'
  //   },
  //   privateKeyEncoding: {
  //     type: 'pkcs8',
  //     format: 'pem'
  //   }
  // });
}

function saveKeys(publicKey:string, EN_privateKey:string, salt:string, EN_entryKey:string) {
  localStorage.setItem('public_key',publicKey)
  localStorage.setItem('en_private_key',EN_privateKey)
  localStorage.setItem('salt',salt)
}

function generateEncryptedEntryKey(publicKey:string) {
  //generate ENTRY KEY
  const entryKey = CryptoJS.lib.WordArray.random(128/8)
    , en_entry_key = CryptoJS.AES.encrypt(entryKey, publicKey).ciphertext.toString()

  localStorage.setItem('en_entry_key',en_entry_key)
  console.log('entry key: ' + entryKey)
  return en_entry_key
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