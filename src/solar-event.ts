import { isSeasonName, type SeasonName } from './season.ts'

export type SolarEventName = SeasonName | 'perihelion' | 'aphelion'

export type SolarEvent = {
  name: SolarEventName
  date: Date
}

export const isSeasonEvent = (
  event: unknown,
): event is SolarEvent & { name: SeasonName } =>
  isSolarEvent(event) && isSeasonName(event.name)

export const isSolarEvent = (event: unknown): event is SolarEvent =>
  !!event &&
  typeof event === 'object' &&
  'date' in event &&
  event.date instanceof Date &&
  'name' in event &&
  isEventName(event.name)

export const isEventName = (s: unknown): s is SolarEventName =>
  isSeasonName(s) || s === 'perihelion' || s === 'aphelion'
