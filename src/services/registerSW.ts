import { register } from 'register-service-worker'

export function registerSW() {
  if (import.meta.env.NODE_ENV === 'production') register('/service-worker.js', {
    registrationOptions: {
      scope: './'
    }
  })
}