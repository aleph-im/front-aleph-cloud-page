'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function toBigIntLE(buf) {
  const reversed = Buffer.from(buf)
  reversed.reverse()
  const hex = reversed.toString('hex')
  return hex.length === 0 ? BigInt(0) : BigInt(`0x${hex}`)
}

function toBigIntBE(buf) {
  const hex = buf.toString('hex')
  return hex.length === 0 ? BigInt(0) : BigInt(`0x${hex}`)
}

function toBufferLE(num, width) {
  const hex = num.toString(16)
  const buffer = Buffer.from(
    hex.padStart(width * 2, '0').slice(0, width * 2),
    'hex'
  )
  buffer.reverse()
  return buffer
}

function toBufferBE(num, width) {
  const hex = num.toString(16)
  return Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex')
}

exports.toBigIntLE = toBigIntLE
exports.toBigIntBE = toBigIntBE
exports.toBufferLE = toBufferLE
exports.toBufferBE = toBufferBE
