import CryptoJS from 'crypto-js'
import * as icons from 'lucide-vue-next'
import { v4 as uuidv4 } from 'uuid'

import { Client, Token } from '@/database/database'
import type { Icon, ILucideIcon } from '@/shared/types'

export function getAcronym(name?: string): string {
  if (!name) return ''
  if (name.indexOf(' ') === -1) return name.slice(0, 2).toUpperCase()
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

export function m2s(miliseconds: number): number {
  return Math.floor(miliseconds / 1000)
}

export async function generateSignInToken(deviceId: string): Promise<string> {
  return encrypt(deviceId)
}

export function extractSignToken(encryptToken: string) {
  return decrypt(encryptToken)
}

export async function generateAttendanceToken(id: string): Promise<string> {
  const key = uuidv4()
  const client = await Client.read(id)
  if (client && client.token) return client.token
  await Token.createToken(key, { clientId: id })
  await Client.update({ id: id, token: key })
  return key
}

export function encrypt(input: string): string {
  return CryptoJS.AES.encrypt(input, import.meta.env.VITE_SECRET_ENCRYPT).toString()
}

export function decrypt(input: string): string {
  return CryptoJS.AES.decrypt(input, import.meta.env.VITE_SECRET_ENCRYPT).toString(CryptoJS.enc.Utf8)
}
export function getIcon(name: ILucideIcon): Icon {
  return icons[name] as Icon
}

export function capitalizeFirstLetter(input: string): string {
  return input.includes('-') ? input.split('-').map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join(' ') : input.charAt(0).toUpperCase() + input.slice(1)
}

export function csvToArray(csvData: string) {
  const rows = csvData.trim().split('\n').slice(1)
  const array: {
    studentId: string
    name: string
    email: string
    password: string
    class: string
  }[]
   = []
  for (const row of rows) {
    const columns = row.split(',')
    if (columns.every(column => column === '')) continue
    array.push({
      studentId: columns[0],
      name: columns[1],
      email: columns[2],
      password: columns[3],
      class: columns[4]
    })
  }
  return array
}

export function shortenFileName(fileName: string, maxLength = 10) {
  if (fileName.length <= maxLength) return fileName
  const extensionIndex = fileName.lastIndexOf('.')
  const extension = extensionIndex !== -1 ? fileName.slice(extensionIndex) : ''
  const truncatedName = fileName.slice(0, maxLength - extension.length)
  return truncatedName + '...' + extension
}

export function removeUndefinedValues(obj: Record<string, any>) {
  const filteredEntries = Object.entries(obj).filter(([, value]) => value !== undefined)
  return Object.fromEntries(filteredEntries)
}