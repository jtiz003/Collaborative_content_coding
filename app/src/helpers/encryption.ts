export const encryptedHelpers = {
  generateEncryptedKeys,
  saveKeys,
  generateEntryKey
}

const crypto = require('crypto')

function generateEncryptedKeys(phrase:string) {
  // randomly generate a salt and hash the phrase
  const salt = crypto.randomBytes(16).toString('base64')
    , hash = crypto.createHmac("sha256",salt).update(phrase).digest("base64").toString()
    , keys = {salt: salt, public_key:'', en_private_key:''};

  console.log(hash)
  console.log(keys)

  const { publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: hash
    }
  });

  console.log(publicKey)
  console.log(privateKey)

  const publicKeyLines = publicKey.split('\n')
  publicKeyLines.splice(0,2)
  publicKeyLines.splice(-2)

  const privateKeyLines= privateKey.split('\n')
  privateKeyLines.splice(0,2)
  privateKeyLines.splice(-2)

  keys.public_key = publicKeyLines.join('')
  keys.en_private_key = privateKeyLines.join('')

  console.log( keys)

  return keys
}
//
// generateEncryptedKeys('ywu660')


function saveKeys(EN_privateKey:string, salt:string) {
  localStorage.setItem('en_private_key',EN_privateKey)
  localStorage.setItem('salt',salt)
}

function generateEntryKey() {
 return crypto.generateKeySync('hmac', 64).export.toString('base64');
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