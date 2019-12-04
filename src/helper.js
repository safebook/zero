/* global Uint8Array */
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'

export default {
  decode (encodedData) {
    return naclUtil.decodeBase64(encodedData)
  },
  createKeys () {
    const o = nacl.box.keyPair()
    return [o.secretKey, o.publicKey]
  },
  createKeysFromEncodedSeckey (encodedSeckey) {
    const seckey = naclUtil.decodeBase64(encodedSeckey)
    const o = nacl.box.keyPair.fromSecretKey(seckey)
    return [o.secretKey, o.publicKey]
  },
  encryptMessage (plaintext, publicKey, secretKey) {
    const msgData = naclUtil.decodeUTF8(plaintext)
    // pad msgData
    const nonce = nacl.randomBytes(nacl.box.nonceLength)
    const box = nacl.box(msgData, nonce, naclUtil.decodeBase64(publicKey), secretKey)
    let res = new Uint8Array(nonce.length + box.length)
    res.set(nonce)
    res.set(box, nonce.length)
    return naclUtil.encodeBase64(res)
  },
  decryptMessage (message, publicKey, secretKey) {
    const data = naclUtil.decodeBase64(message)
    const nonce = data.slice(0, nacl.box.nonceLength)
    const box = data.slice(nacl.box.nonceLength, data.length)
    const msgData = nacl.box.open(box, nonce, naclUtil.decodeBase64(publicKey), secretKey)
    if (msgData) {
      return naclUtil.encodeUTF8(msgData)
    } else {
      return null
    }
  }
}
