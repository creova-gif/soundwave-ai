import { afterEach, describe, expect, it } from 'vitest'
import {
  decryptBotToken,
  encryptBotToken,
  maskBotToken,
  sealBotToken,
} from '@/lib/crypto/bot-token'

const ORIGINAL = process.env.TOKEN_ENCRYPTION_KEY

describe('bot token sealing', () => {
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.TOKEN_ENCRYPTION_KEY
    else process.env.TOKEN_ENCRYPTION_KEY = ORIGINAL
  })

  it('encrypts at rest and returns only a mask', () => {
    process.env.TOKEN_ENCRYPTION_KEY = 'test-only-token-encryption-key'
    const plaintext = '000000000:TEST'
    const sealed = sealBotToken(plaintext)

    expect(sealed.startsWith('enc:v1:')).toBe(true)
    expect(sealed).not.toContain(plaintext)
    expect(decryptBotToken(sealed)).toBe(plaintext)

    const mask = maskBotToken(sealed)
    expect(mask).toBe('••••TEST')
    expect(mask).not.toContain('000000000')
    expect(maskBotToken(plaintext)).toBe('••••TEST')
  })

  it('refuses to seal when the encryption key is missing', () => {
    delete process.env.TOKEN_ENCRYPTION_KEY
    expect(() => sealBotToken('000000000:TEST')).toThrow()
  })

  it('masks a sealed value without revealing it when the key is missing', () => {
    process.env.TOKEN_ENCRYPTION_KEY = 'test-only-token-encryption-key'
    const sealed = encryptBotToken('000000000:TEST')
    delete process.env.TOKEN_ENCRYPTION_KEY
    expect(maskBotToken(sealed)).toBe('••••••••')
  })
})
