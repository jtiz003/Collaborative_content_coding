import * as crypto from 'crypto'
import { EncryptionServices } from '../services/EncryptionService'
import AES from 'crypto-js/aes'
import Base64 from 'crypto-js/enc-base64'

const forge = require('node-forge')
  ,  pki = forge.pki;

export const EncryptedHelpers = {
  generateKeys,
  encryptData,
  decryptData,
}

async function generateKeys(phrase: string) {
  // randomly generate a salt and hash the phrase
  const salt = crypto.randomBytes(16).toString('base64')
    , hashPhrase = crypto.createHmac("sha256", salt).update(phrase).digest("base64").toString()
    , keys = { salt: salt, public_key: '', en_private_key: '' };

  // generate public and private keypair
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
  return pki.privateKeyToPem(pki.decryptRsaPrivateKey(en_private_key, hashPhrase))
}

async function decryptEncryptedEntryKey(privateKey_pem:string, en_entry_key:string) {
  const derData = window.atob(en_entry_key)
  const privateKey = await importPrivateKey(privateKey_pem);

  const entry_key = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP'},
      privateKey,
      str2ab(derData));

  return ab2Str(entry_key)
}

async function importPrivateKey(privateKey_pem:string) {
  const privateKey_pkcs8 = pem2pkcs8(privateKey_pem)

  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  let pemContents = privateKey_pkcs8.replace(pemHeader,'');
  pemContents = pemContents.replace(pemFooter,'');
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

return await window.crypto.subtle.importKey("pkcs8", binaryDer,
  {
    name: "RSA-OAEP",
    hash: {name: "SHA-256"},
  },
  false,
  ["decrypt"]);
}

function str2ab(str:string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2Str(ab:ArrayBuffer) {
  let exportedAsString = ''
  const bytes = new Uint8Array(ab)
  for (var i = 0; i < bytes.byteLength; i++) {
    exportedAsString += String.fromCharCode(bytes[i]);
  }
  return exportedAsString
}

function pem2pkcs8 (pem:string) {
  const privateKey_forge =pki.privateKeyFromPem(pem);
  const rsaPrivateKey = pki.privateKeyToAsn1(privateKey_forge);
  const privateKeyInfo = pki.wrapRsaPrivateKey(rsaPrivateKey);
  return pki.privateKeyInfoToPem(privateKeyInfo);
}

async function encryptData(phrase:string, file:File, firebase:any,email:string) {
  // get them from local storage
  // await getKeys(email, firebase)
console.log(localStorage)
  console.log('hello')
  // get these keys from local storage
  const en_private_key = ''
  const salt = ''
  const en_entry_key = ''
  //const privateKey = decryptEncryptedPrivateKey(en_private_key, phrase,salt)
  //const entry_key = decryptEncryptedEntryKey(privateKey, en_entry_key)

  // get the text of the file
  const lines = await getText(file)
  const encryptedDataArray = []
  for (var x in lines) {
    const value = lines[x]
    const encrypted = AES.encrypt(value, '9qkXCI9ANZGjwnjr8ejcutwQ/LZhAEX4Cjw8moPmc2w=')
    encryptedDataArray.push(encrypted.ciphertext.toString(Base64))

  }

  return encryptedDataArray
}

function decryptData(phrase:string, file:File) {

}

function getKeys(email:string, firebase:any) {

  let en_private_key = localStorage.getItem('en_private_key')
  let public_key = localStorage.getItem('public_key')
  let salt = localStorage.getItem('salt')
  let en_entry_key = localStorage.getItem('en_entry_key')


  // check if its in the local storage
  if(en_private_key === null || public_key === null || salt === null) {
    const userKey = EncryptionServices.getUserKeys(email,firebase).then((data) => {
      localStorage.setItem('en_private_key','')
      localStorage.setItem('public_key','')
      localStorage.setItem('salt','')
    })
  }

  if(en_entry_key === null ) {
    const userKey = EncryptionServices.getUserKeys(email,firebase).then((data) => {
      localStorage.setItem('en_entry_key','')
    })
  }

}

async function getText(file:File) {
  let text = await file.text();
  text = text.replace(/['"]+/g, '')
  const lines = text.split("\r\n")
  const firstLine = 'ID,DOCUMENT'
  const dataArray = []

  for (let x in lines) {
    if (lines[x].includes(firstLine)) { // remove the fist line
      lines.shift()
    } else {
      const value = lines[x].split(',')[1]
      dataArray.push(value)
    }
  }
  return dataArray
}





