import { readFileSync, writeFileSync } from 'fs'
import { loadSolarEvents } from './load-solar-events.ts'
import { isSeasonEvent, type SolarEvent } from './solar-event.ts'
import { dataFile } from './folders.ts'

export const seasonNames = [
  'imbolc',
  'spring',
  'beltane',
  'summer',
  'lughnasadh',
  'autumn',
  'samhain',
  'winter',
] as const

export type SeasonName = (typeof seasonNames)[number]

export type SolarSeason = {
  name: SeasonName
  date: Date
  days: number
  gyear: number
}

export const seasonNumber: Record<SeasonName, number> = {
  winter: 1,
  imbolc: 2,
  spring: 3,
  beltane: 4,
  summer: 5,
  lughnasadh: 6,
  autumn: 7,
  samhain: 8,
}

export const isSeasonName = (s: unknown): s is SeasonName =>
  typeof s === 'string' && seasonNames.includes(s as SeasonName)

const fromJson = (file: string) =>
  JSON.parse(readFileSync(file, 'utf8')).map((s: SolarSeason) => {
    s.date = new Date(s.date)
    return s
  }) as SolarSeason[]

let seasons: SolarSeason[]
export const getSeasons = (): SolarSeason[] => {
  if (seasons) return seasons
  try {
    return seasons = fromJson(dataFile('solar-seasons.json'))
  } catch {
    seasons = seasonsFromEvents(loadSolarEvents())
    writeFileSync(
      dataFile('solar-seasons.json'),
      JSON.stringify(seasons, null, 2) + '\n',
    )
    return seasons
  }
}

// calculate a set of seasons from a list of events
const seasonsFromEvents = (solarEvents: SolarEvent[]) => {
  const solarSeasons: SolarSeason[] = []
  const seasonEvents: (SolarEvent & { name: SolarSeason['name'] })[] =
    solarEvents.filter(evt => isSeasonEvent(evt))

  for (let i = 0; i < seasonEvents.length; i++) {
    const cur = seasonEvents[i]
    const next = seasonEvents[i + 1]
    if (!next) continue
    if (!isSeasonEvent(cur) || !isSeasonEvent(next)) continue
    const startDay = new Date(
      `${cur.date.getFullYear()}-${cur.date.getMonth() + 1}-${cur.date.getDate()}`,
    )
    const endDay = new Date(
      `${next.date.getFullYear()}-${next.date.getMonth() + 1}-${next.date.getDate()}`,
    )
    const days = Math.round(
      (endDay.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000),
    )
    const gyear =
      cur.date.getUTCFullYear() - 2024 + (cur.name === 'winter' ? 1 : 0)
    solarSeasons.push({ ...cur, days, gyear })
  }
  return solarSeasons
}
