/* global Uint8Array */
import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'
import base58 from 'bs58'

export default {
  encodeBase58 (typedArray) {
    return base58.encode(Buffer.from(typedArray))
  },
  decodeBase58 (base58String) {
    return base58.decode(base58String)
  },
  createKeys () {
    const o = nacl.box.keyPair()
    return [o.secretKey, o.publicKey]
  },
  createKeysFromEncodedSeckey (encodedSeckey) {
    const seckey = this.decodeBase58(encodedSeckey)
    const o = nacl.box.keyPair.fromSecretKey(seckey)
    return [o.secretKey, o.publicKey]
  },
  encryptMessage (plaintext, publicKey, secretKey) {
    const msgData = naclUtil.decodeUTF8(plaintext)
    // pad msgData
    const nonce = nacl.randomBytes(nacl.box.nonceLength)
    const box = nacl.box(msgData, nonce, this.decodeBase58(publicKey), secretKey)
    let res = new Uint8Array(nonce.length + box.length)
    res.set(nonce)
    res.set(box, nonce.length)
    return this.encodeBase58(res)
  },
  decryptMessage (message, publicKey, secretKey) {
    const data = this.decodeBase58(message)
    const nonce = data.slice(0, nacl.box.nonceLength)
    const box = data.slice(nacl.box.nonceLength, data.length)
    const msgData = nacl.box.open(box, nonce, this.decodeBase58(publicKey), secretKey)
    if (msgData) {
      return naclUtil.encodeUTF8(msgData)
    } else {
      return null
    }
  }
}
