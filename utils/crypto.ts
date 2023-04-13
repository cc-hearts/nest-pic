import { createHash, createCipheriv, createDecipheriv } from 'crypto'

import { getConfig } from './readConfig'

export function encodeMd5(str: string) {
  const md5 = createHash('md5')
  const encodeStr = md5.update(str)
  return encodeStr.digest('hex')
}

const { CRYPTO_SECRET_KEY, CRYPTO_IV, CRYPTO_ALGORITHM } = getConfig()
const algorithm = CRYPTO_ALGORITHM
const secretKey = CRYPTO_SECRET_KEY // length === 32 (randomBytes(32))
const iv = CRYPTO_IV // randomBytes(16).toString('hex');

/**
 * 加密字段
 * @param text
 */
export function encrypt(text: string) {
  const cipher = createCipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'))
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return encrypted.toString('hex')
}

/**
 * 解密字段
 * @param {string} content
 */
export function decrypt(content: string) {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex')
  )

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(content, 'hex')),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}
