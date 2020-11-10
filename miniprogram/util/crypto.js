var CryptoJS = require('./crypto-js.js');  //引用AES源码js

function Encrypt(word, keyStr){ 
  keyStr = keyStr ? keyStr : '0102030405060708';
  var key  = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode:CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}
//解密方法 word待解密数据,keyStr密钥
function Decrypt(word, keyStr){
  keyStr = keyStr ? keyStr : '0102030405060708';
  var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  // var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  // console.log('decrypt====', CryptoJS.enc.Utf8.stringify(decrypt))
  // return CryptoJS.enc.Utf8.stringify(decrypt).toString();

  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(encryptedBase64Str, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  console.log('decrypt====', decrypt)
  console.log('decrypt====', decrypt.toString())
  console.log('decrypt====', decrypt.toString(CryptoJS.enc.Utf8))
  // return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
//暴露接口
module.exports.Decrypt = Decrypt;
module.exports.Encrypt= Encrypt;