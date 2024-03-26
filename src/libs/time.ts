import { DateTime, Info } from 'luxon'

export function parseISODate(date: string) {
  const dt = DateTime.fromISO(date)
  return {
    day: dt.day,
    hour: dt.hour,
    minute: dt.minute,
    second: dt.second,
    weekday: Info.weekdays()[dt.weekday - 1],
  }
}

export function formatISODate(date: string) {
  return DateTime.fromISO(date).toFormat('yyyy-MM-dd HH:mm:ss')
}

export function today(date?: string) {
  if (!date) return false
  const dt = DateTime.fromISO(date)
  const today = DateTime.now()
  return dt.hasSame(today, 'day')
}