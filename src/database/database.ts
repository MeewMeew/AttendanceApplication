
import { collection, deleteDoc, deleteField, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'

import { removeUndefinedValues } from '@/libs/utils'
import { AttendanceStatus } from '@/shared/constants'
import { db } from '@/shared/firebase'

export interface IQrSign {
  id: string;
  time: number;
  status: 'waiting' | 'signed' | 'waiting-accept';
}

export interface IClient {
  id: string;
  name: string;
  status: 'online' | 'offline';
  createdAt: number;
  index?: number;
  additionalData?: string;
  token?: string;
  used?: boolean;
}

export type IUser = {
  displayName: string
  email: string
  uid: string
  role: 'admin' | 'user'
  studentId: string
  totalOnTime: number
  totalLate: number
  lastAttendance: string
  index?: number
  createdAt?: string
  photoURL?: string
  class?: string
}

export interface ITokenData {
  clientId: string;
}

export interface IAttendance {
  id: string;
  date: string;
  userId: string;
  clientId: string;
  status: AttendanceStatus;
}

export class Attendance {
  static async sign(data: IAttendance) {
    const attendanceRef = doc(db, 'users', data.userId, 'attendance', data.id)
    await setDoc(attendanceRef, data)
  }

  static async isSigned(data: Pick<IAttendance, 'id' | 'userId'>) {
    const attendanceRef = doc(db, 'users', data.userId, 'attendance', data.id)
    const attendanceSnap = await getDoc(attendanceRef)
    return attendanceSnap.exists()
  }
}

export class Token {
  static async createToken(key: string, data: ITokenData) {
    const tokenRef = doc(db, 'tokens', key)
    await setDoc(tokenRef, data, { merge: true })
  }

  static async readToken(key: string) {
    const tokenRef = doc(db, 'tokens', key)
    const tokenSnap = await getDoc(tokenRef)
    return tokenSnap.data() as ITokenData
  }

  static async deleteToken(key: string) {
    const tokenRef = doc(db, 'tokens', key)
    await Client.deleteToken((await this.readToken(key)).clientId)
    await deleteDoc(tokenRef)
  }
}

export class Client {
  static async create (client: IClient) {
    const clientRef = doc(db, 'clients', client.id)
    await setDoc(clientRef, { ...client, createdAt: Date.now()})
  }

  static async read (deviceID: string) {
    const clientRef = doc(db, 'clients', deviceID)
    const clientSnap = await getDoc(clientRef)
    return clientSnap.data() as IClient
  }

  static async update (client: Partial<IClient>, merge = true) {
    const clientRef = doc(db, 'clients', client.id!)
    await setDoc(clientRef, client, { merge: merge })
  }

  static async deleteToken (deviceID: string) {
    const clientRef = doc(db, 'clients', deviceID)
    await updateDoc(clientRef, { token: await deleteField()})
  }

  static async delete (deviceID: string) {
    const clientRef = doc(db, 'clients', deviceID)
    await deleteDoc(clientRef)
  }

  static async readAll () {
    const clientsRef = collection(db, 'clients')
    const clientsSnap = await getDocs(clientsRef)
    const clients: IClient[] = []
    clientsSnap.forEach(clientSnap => clients.push(clientSnap.data() as IClient))
    return clients
  }

  static async toggle(id: string) {
    const client = await this.read(id)
    await this.update({ id: id, status: client.status === 'online' ? 'offline' : 'online' })
  }
}

export class User {
  static async create (user: Partial<IUser>) {
    if (!user.uid) throw new Error('User ID is required')
    user.totalOnTime = 0
    user.totalLate = 0
    user.lastAttendance = ''
    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, user)
  }

  static async read (uid: string) {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    return userSnap.data() as IUser
  }

  static async update (user: Partial<IUser>) {
    if (!user.uid) throw new Error('User ID is required')
    if (user.role) delete user.role

    const userRef = doc(db, 'users', user.uid!)
    await setDoc(userRef, removeUndefinedValues(user), { merge: true })
  }

  static async delete (uid: string) {
    if (!uid) throw new Error('User ID is required')
    const userRef = doc(db, 'users', uid)
    await deleteDoc(userRef)
  }
}