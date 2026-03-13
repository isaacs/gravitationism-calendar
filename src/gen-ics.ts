import type { EventAttributes, HeaderAttributes } from 'ics'
import { createEvents } from 'ics'
import { getSeasons } from './season.ts'
import { getMonths } from './months.ts'
import { loadSolarEvents } from './load-solar-events.ts'
import { isSeasonEvent } from './solar-event.ts'
import { GravitationismDate } from './gravitationism-date.ts'

const MONTHS = process.argv[2] === 'months'

const headers: HeaderAttributes = {
  productId:
    MONTHS ? 'gravitationism-lunar-months' : 'gravitationism-seasons',
  method: 'PUBLISH',
  calName: `Gravitationism ${MONTHS ? 'Lunar' : 'Solar'} Calendar`,
}

const eventList: EventAttributes[] = []

if (!MONTHS) {
  // get the perihelion/aphelion
  for (const event of loadSolarEvents()) {
    if (isSeasonEvent(event)) {
      continue
    }
    const { name, date } = event
    const gyear = date.getFullYear() - 2024
    const cap = name.charAt(0).toUpperCase() + name.substring(1)
    eventList.push({
      ...headers,
      start: event.date.getTime(),
      startInputType: 'utc',
      startOutputType: 'utc',
      title: event.name,
      description: `G${gyear} ${cap}`,
      uid: `${date.getFullYear()}-${name}-${date.getTime()}-actual`,
      duration: { hours: 1 },
    })
  }

  for (const event of getSeasons()) {
    const { date, name, days, gyear } = event
    const cap = name.charAt(0).toUpperCase() + name.substring(1)
    eventList.push({
      ...headers,
      start: date.getTime(),
      startInputType: 'utc',
      startOutputType: 'utc',
      title: name,
      description: `G${gyear} ${cap}`,
      uid: `${date.getFullYear()}-${name}-${date.getTime()}-actual`,
      duration: { hours: 1 },
    })

    const e = new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
    for (
      let s = date, day = 0;
      s < e;
      s = new Date(date.getTime() + day * 24 * 60 * 60 * 1000)
    ) {
      s = new Date(date.getTime() + day * 24 * 60 * 60 * 1000)
      const end = new Date(date.getTime() + day * 24 * 60 * 60 * 1000)
      const g = new GravitationismDate(s)
      eventList.push({
        start: [s.getFullYear(), s.getMonth() + 1, s.getDate()],
        startInputType: 'local',
        startOutputType: 'local',
        title: `${name}` + (day ? ' ' + day : ''),
        description: `
${g.shortString}
${g.fullString}
${date.toISOString()}`,
        uid: `${date.getFullYear()}-${name}-${day ? day + '-' : ''}${s.getTime()}`,
        end: [end.getFullYear(), end.getMonth() + 1, end.getDate()],
      })
      day++
    }
  }
} else {
  for (const month of getMonths()) {
    const { name, start, end } = month
    const days = Math.round(
      (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
    )
    eventList.push({
      ...headers,
      start: [start.getFullYear(), start.getMonth() + 1, start.getDate()],
      end: [end.getFullYear(), end.getMonth() + 1, end.getDate()],
      startInputType: 'local',
      startOutputType: 'local',
      title: name,
      description: `${name}\n${start.toISOString()}\n${days} days`,
      uid: `${start.getFullYear()}-${name}-${start.getTime()}`,
    })
  }
}

const { error, value } = createEvents(eventList, headers)
if (error) throw error
console.log(value)
