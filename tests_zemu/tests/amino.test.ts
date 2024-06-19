/** ******************************************************************************
 *  (c) 2018-2022 Zondax GmbH
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************* */

import Zemu, { ClickNavigation, TouchNavigation } from '@zondax/zemu'
// @ts-ignore
import CosmosApp from '@zondax/ledger-cosmos-js'
import {
  defaultOptions,
  DEVICE_MODELS,
  example_tx_str_basic,
  example_tx_str_basic2,
  ibc_denoms,
  AMINO_JSON_TX,
  setWithdrawAddress,
  cliGovDeposit,
  example_tx_str_msgMultiSend,
} from './common'

// @ts-ignore
import secp256k1 from 'secp256k1/elliptic'
// @ts-ignore
import crypto from 'crypto'
import { ButtonKind, IButton } from '@zondax/zemu/dist/types'

jest.setTimeout(120000)

describe('Amino', function () {
  //eslint-disable-next-line jest/expect-expect
  test.concurrent.each(DEVICE_MODELS)('can start and stop container', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('sign basic normal', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      const path = "m/44'/118'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic), 'utf-8')
      const hrp = 'cosmos'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)

      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-sign_basic`)

      const resp = await signatureRequest
      console.log(resp)

      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const hash = crypto.createHash('sha256')
      const msgHash = Uint8Array.from(hash.update(tx).digest())

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('sign basic normal2', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      const path = "m/44'/118'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic2))
      const hrp = 'cosmos'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)
      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-sign_basic2`)

      const resp = await signatureRequest
      console.log(resp)

      // Now verify the signature
      const hash = crypto.createHash('sha256')
      const msgHash = Uint8Array.from(hash.update(tx).digest())

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('sign basic with extra fields', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      const path = "m/44'/118'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic))
      const hrp = 'cosmos'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)
      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-sign_basic_extra_fields`)

      const resp = await signatureRequest
      console.log(resp)
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const hash = crypto.createHash('sha256')
      const msgHash = Uint8Array.from(hash.update(tx).digest())

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('ibc denoms', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      const path = "m/44'/118'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(ibc_denoms))
      const hrp = 'cosmos'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)
      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-ibc_denoms`)

      const resp = await signatureRequest
      console.log(resp)
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const hash = crypto.createHash('sha256')
      const msgHash = Uint8Array.from(hash.update(tx).digest())

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('SetWithdrawAddress', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      const path = "m/44'/118'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(setWithdrawAddress))
      const hrp = 'cosmos'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)
      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-setWithdrawAddress`)

      const resp = await signatureRequest
      console.log(resp)
      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const hash = crypto.createHash('sha256')
      const msgHash = Uint8Array.from(hash.update(tx).digest())

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('CLIGovDeposit', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      const path = "m/44'/118'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(cliGovDeposit))
      const hrp = 'cosmos'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)
      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-govDeposit`)

      const resp = await signatureRequest
      console.log(resp)

      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const hash = crypto.createHash('sha256')
      const msgHash = Uint8Array.from(hash.update(tx).digest())

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('MsgMultisend', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      // Activate expert mode
      await sim.toggleExpertMode()

      const path = "m/44'/118'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(example_tx_str_msgMultiSend))
      const hrp = 'cosmos'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)
      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-msgMultiSend`)

      const resp = await signatureRequest
      console.log(resp)

      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const hash = crypto.createHash('sha256')
      const msgHash = Uint8Array.from(hash.update(tx).digest())

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('SetWithdrawAddress-eth', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      // Change to expert mode so we can skip fields
      await sim.toggleExpertMode()

      const path = "m/44'/60'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(setWithdrawAddress))
      const hrp = 'inj'

      // get address / publickey
      const respPk = await app.getAddressAndPubKey(path, hrp)
      console.log(respPk)

      // do not wait here..
      const signatureRequest = app.sign(path, tx, hrp, AMINO_JSON_TX)

      // Wait until we are not in the main menu
      await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
      await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-setWithdrawAddress-eth`)

      const resp = await signatureRequest
      console.log(resp)

      expect(resp).toHaveProperty('signature')

      // Now verify the signature
      const sha3 = require('js-sha3')
      const msgHash = Buffer.from(sha3.keccak256(tx), 'hex')

      const signatureDER = resp.signature
      const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

      const pk = Uint8Array.from(respPk.compressed_pk)

      const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
      expect(signatureOk).toEqual(true)
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('sign basic normal Eth', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      // Enable expert to allow sign with eth path
      await sim.toggleExpertMode()

      const path = "m/44'/60'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic), 'utf-8')
      const hrp = 'inj'

      // check with invalid HRP
      try {
        const errorRespPk = await app.getAddressAndPubKey(path, 'forbiddenHRP')

        // do not wait here..
        const signatureRequest = app.sign(path, tx, hrp)

        // Wait until we are not in the main menu
        await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
        await sim.compareSnapshotsAndApprove('.', `${m.prefix.toLowerCase()}-sign_basic_eth`)

        const resp = await signatureRequest
        console.log(resp)

        // get address / publickey
        const respPk = await app.getAddressAndPubKey(path, hrp)
        console.log(respPk)

        // Now verify the signature
        const sha3 = require('js-sha3')
        const msgHash = Buffer.from(sha3.keccak256(tx), 'hex')

        const signatureDER = resp.signature
        const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER))

        const pk = Uint8Array.from(respPk.compressed_pk)

        const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk)
        expect(signatureOk).toEqual(true)
      } catch (e: any) {
        expect(e.message).toEqual('Transaction rejected')
      }
    } finally {
      await sim.close()
    }
  })

  test.concurrent.each(DEVICE_MODELS)('sign basic normal Eth no expert', async function (m) {
    const sim = new Zemu(m.path)
    try {
      await sim.start({ ...defaultOptions, model: m.name })
      const app = new CosmosApp(sim.getTransport())

      const path = "m/44'/60'/0'/0/0"
      const tx = Buffer.from(JSON.stringify(example_tx_str_basic), 'utf-8')

      try {
        // get address / publickey
        const respPk = await app.getAddressAndPubKey(path, 'inj')

        // do not wait here..
        const signatureRequest = app.sign(path, tx, 'inj')

        // Wait until we are not in the main menu
        await sim.waitUntilScreenIsNot(sim.getMainMenuSnapshot())
        let nav = undefined
        if (m.name === 'stax') {
          const okButton: IButton = {
            x: 200,
            y: 540,
            delay: 0.25,
          }
          nav = new TouchNavigation([ButtonKind.ConfirmYesButton])
          nav.schedule[0].button = okButton
        } else {
          nav = new ClickNavigation([1, 0])
        }
        await sim.navigate('.', `${m.prefix.toLowerCase()}-sign_basic_eth_warning`, nav.schedule)

        const resp = await signatureRequest
        console.log(resp)
      } catch (e: any) {
        expect(e.message).toEqual('Data is invalid')
      }
    } finally {
      await sim.close()
    }
  })
})
