require('dotenv').config();
const fs = require('fs');
const cbor = require('cbor')
const request = require('request')
const { createHash } = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')
const { CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')

FAMILY_NAME = 'hexchainiot'

function hash(v) {
  return createHash('sha512')
    .update(v)
    .digest('hex')
}

class HexchainIOTClient {
  constructor(deviceId) {

    const privateKeyStr = this.getUserPriKey(deviceId).trim()
    //const privateKeyStr = privateKeyStrBuf.toString().trim()
    
    //console.log(privateKeyStr)
   
    const context = createContext('secp256k1')
    const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr)
    this.signer = new CryptoFactory(context).newSigner(privateKey)
    this.publicKey = this.signer.getPublicKey().asHex()
    this.address =
      hash('hexchainiot').substr(0, 6) + hash(this.publicKey).substr(0, 64)
    console.log('Storing at: ' + this.address)
  }

   getUserPriKey(deviceId) {
    const userprivkeyfile = `${deviceId}.priv`
     return  fs.readFileSync(`/home/nhuthuy/HK2-2020/Nien-luan-nganh/hexchain/deploy/.sawtooth/keys/${userprivkeyfile}`,{encoding:"utf8"})
  }

  // getUserPubKey(deviceId) {
  //   const userpubkeyfile = `${deviceId}.pub`
  //   return fs.readFileSync(`${__dirname}../../deploy/.sawtooth/keys/${userpubkeyfile}`)
  // }

  sendRequest(payload) {
    const payloadBytes = cbor.encode(payload)
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
      familyName: 'hexchainiot',
      familyVersion: '1.1',
      inputs: [this.address],
      outputs: [this.address],
      signerPublicKey: this.signer.getPublicKey().asHex(),
      batcherPublicKey: this.signer.getPublicKey().asHex(),
      dependencies: [],
      payloadSha512: createHash('sha512')
        .update(payloadBytes)
        .digest('hex'),
      nonce: new Date().toString(),
    }).finish()

    const signature = this.signer.sign(transactionHeaderBytes)

    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signature,
      payload: payloadBytes,
    })

    const transactions = [transaction]
    const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: this.signer.getPublicKey().asHex(),
      transactionIds: transactions.map(txn => txn.headerSignature),
    }).finish()

    const batchSignature = this.signer.sign(batchHeaderBytes)
    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: batchSignature,
      transactions: transactions,
    })
    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch],
    }).finish()

    request.post(
      {
        url: 'http://localhost:8008/batches',
        body: batchListBytes,
        headers: { 'Content-Type': 'application/octet-stream' },
      },
      (err, response) => {
        if (err) return console.log(err)
        console.log(response.body)
      },
    )
  }
}

 module.exports.HexchainIOTClient = HexchainIOTClient;

// const hexchain = new HexchainIOTClient('abc1234')
// const payload = {
//   action: 'set',
//   data: JSON.stringify({
//     timestamp: +new Date(),
//     temperature: 11.0,
//     humidity: 12.1,
//   }),
// }

// hexchain.sendRequest(payload)


