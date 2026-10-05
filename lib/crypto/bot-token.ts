import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

const PREFIX = 'enc:v1:'

export class BotTokenError extends Error {
  constructor(readonly code: 'config' | 'invalid') {
    super(code)
    this.name = 'BotTokenError'
  }
}

function encryptionKey(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY
  if (!raw || raw.length < 16) throw new BotTokenError('config')
  return createHash('sha256').update(raw).digest()
}

export function isSealedBotToken(value: string): boolean {
  return value.startsWith(PREFIX)
}

export function encryptBotToken(plaintext: string): string {
  const key = encryptionKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return PREFIX + Buffer.concat([iv, tag, ciphertext]).toString('base64url')
}

export function decryptBotToken(stored: string): string {
  if (!isSealedBotToken(stored)) throw new BotTokenError('invalid')
  const buf = Buffer.from(stored.slice(PREFIX.length), 'base64url')
  if (buf.length < 29) throw new BotTokenError('invalid')
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const ciphertext = buf.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}

export function sealBotToken(plaintext: string): string {
  const trimmed = plaintext.trim()
  if (
    trimmed.length < 8
    || trimmed.length > 256
    || trimmed.includes('••••')
    || isSealedBotToken(trimmed)
  ) {
    throw new BotTokenError('invalid')
  }
  return encryptBotToken(trimmed)
}

function maskTail(plaintext: string): string {
  if (plaintext.length <= 4) return '••••'
  return `••••${plaintext.slice(-4)}`
}

/** Last four characters only. Never the stored ciphertext or the full token. */
export function maskBotToken(stored: string | null | undefined): string | null {
  if (!stored) return null
  if (!isSealedBotToken(stored)) return maskTail(stored)
  try {
    return maskTail(decryptBotToken(stored))
  } catch {
    return '••••••••'
  }
}
