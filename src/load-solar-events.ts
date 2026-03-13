import { readFileSync, writeFileSync } from 'fs'
import { isEventName, type SolarEvent } from './solar-event.ts'

let solarEvents: SolarEvent[]

const fromJson = (file: string) =>
  JSON.parse(readFileSync(file, 'utf8')).map((e: SolarEvent) => {
    e.date = new Date(e.date)
    return e
  }) as SolarEvent[]

export const loadSolarEvents = () => {
  if (solarEvents) return solarEvents
  try { return solarEvents = fromJson('./data/solar-events.json') } catch {}
  solarEvents = []
  const lines = readFileSync('./data/events.txt', 'utf8')
    .trim()
    .split('\n')

  for (const line of lines) {
    if (!line.trim()) continue
    const [name] = line.split(' ', 1)
    if (!isEventName(name)) throw new Error('line without name: ' + line)
    const date = new Date(line.substring(name.length).trim())
    // Only generate for Unix epoch
    // the ics lib doesn't like negative numbers
    if (date.getTime() > 0) {
      const e: SolarEvent = { name, date }
      solarEvents.push(e)
    }
  }

  solarEvents.sort(({ date: a }, { date: b }) => a.getTime() - b.getTime())

  writeFileSync('./data/solar-events.json', JSON.stringify(solarEvents, null, 2) + '\n')

  return solarEvents
}
