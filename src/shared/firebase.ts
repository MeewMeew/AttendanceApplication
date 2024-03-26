import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = import.meta.env['VITE_FIREBASE_CONFIG']
export const app = initializeApp(JSON.parse(firebaseConfig))
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env['VITE_RECAPTCHA_SITE_KEY']),
  isTokenAutoRefreshEnabled: true
})
