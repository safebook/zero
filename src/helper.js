import base58 from 'bs58'

const curve = sjcl.ecc.curves.c384

export default {
  createKeys () {
    const seckey = sjcl.bn.random(curve.r, 10)
    const pubkey = curve.G.mult(seckey).toBits()
    return [seckey, pubkey]
  },
  createKeysFromEncodedSeckey (encodedSeckey) {
    const bitArraySeckey = sjcl.codec.bytes.toBits(base58.decode(encodedSeckey))
    const seckey = sjcl.bn.fromBits(bitArraySeckey)
    const pubkey = curve.G.mult(seckey).toBits()
    return [seckey, pubkey]
  },
  computeSharedKeyFromEncodedPubkey (seckey, encodedPubkey) {
    const bitArrayPubkey = sjcl.codec.bytes.toBits(base58.decode(encodedPubkey))
    const point = curve.fromBits(bitArrayPubkey)
    const sharedPoint = point.mult(seckey)
    return sjcl.hash.sha256.hash(sharedPoint.toBits())
  },
  encryptMessage (plaintext, sharedKey) {
    const bitArrayPlaintext = sjcl.codec.utf8String.toBits(plaintext)
    let bytesPlaintext = sjcl.codec.bytes.fromBits(bitArrayPlaintext)
    if (bytesPlaintext.length > 256) {
      throw new Error('Message size should be <= 256B')
    }
    while (bytesPlaintext.length < 256) {
      bytesPlaintext.push(0)
    }

    const bitArrayPaddedPlaintext = sjcl.codec.bytes.toBits(bytesPlaintext)

    const cipher = new sjcl.cipher.aes(sharedKey)
    const iv = sjcl.random.randomWords(4)
    const ciphertext = sjcl.mode.ccm.encrypt(cipher, bitArrayPaddedPlaintext, iv)
    const msg = sjcl.bitArray.concat(iv, ciphertext)
    return base58.encode(Buffer.from(sjcl.codec.bytes.fromBits(msg)))
  }
}
