import { readFileSync } from 'fs'
import { dataFile } from './folders.ts'

const events: SolarEvent[] = [
  { name: 'winter', date: new Date('1949 Dec 22 04:23 UTC') },
]

type SolarEvent = {
  name:
    | 'imbolc'
    | 'spring'
    | 'beltane'
    | 'summer'
    | 'lughnasadh'
    | 'autumn'
    | 'samhain'
    | 'winter'
    | 'perihelion'
    | 'aphelion'
  date: Date
}

// perihelion/aphelion from giss
// https://data.giss.nasa.gov/modelE/ar5plots/srvernal.html
const gissDateLength = '7/04 14:37'.length
for (const line of readFileSync(dataFile('giss.txt'), 'utf8')
  .trim()
  .split('\n')
  .map(s => s.trim())
  .filter(s => /^[0-9]{4}/.test(s))) {
  const year = line.substring(0, 4)
  const ap = line.substring(line.length - gissDateLength)
  const p = line.substring(0, line.length - gissDateLength).trim()
  const pe = p.substring(p.length - gissDateLength)
  events.push({
    name: 'perihelion',
    date: new Date(`${year}/${pe} UTC`),
  })
  events.push({
    name: 'aphelion',
    date: new Date(`${year}/${ap} UTC`),
  })
}

for (const section of readFileSync(
  dataFile('russellcottrell.txt'),
  'utf8',
).split('\n\n')) {
  const lines = section
    .split('\n')
    .map(s => s.substring(4, 4 + '1950 Mar 21 04:35 UTC'.length)) as [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ]
  events.push({ name: 'imbolc', date: new Date(lines[0]) })
  events.push({ name: 'spring', date: new Date(lines[1]) })
  events.push({ name: 'beltane', date: new Date(lines[2]) })
  events.push({ name: 'summer', date: new Date(lines[3]) })
  events.push({ name: 'lughnasadh', date: new Date(lines[4]) })
  events.push({ name: 'autumn', date: new Date(lines[5]) })
  events.push({ name: 'samhain', date: new Date(lines[6]) })
  events.push({ name: 'winter', date: new Date(lines[7]) })
}

for (const ev of events.sort(
  ({ date: a }, { date: b }) => a.getTime() - b.getTime(),
)) {
  console.log(`${ev.name} ${ev.date.toISOString()}`)
}
