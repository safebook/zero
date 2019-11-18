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
  }
}
