import { readFileSync, writeFileSync } from 'fs'
import { getSeasons } from './season.ts'

export const lunarMonthNames = [
  'January',
  'Primember',
  'Duember',
  'Triember',
  'Fourember',
  'Pentember',
  'Sexember',
  'September',
  'October',
  'November',
  'December',
  'Elfember',
  'Fayember',
] as const

export type LunarMonthName = (typeof lunarMonthNames)[number]

export type LunarMonth = {
  name: LunarMonthName
  start: Date
  end: Date
}

const fromJson = (file: string): LunarMonth[] =>
  JSON.parse(readFileSync(file, 'utf8')).map((s: LunarMonth) => {
    s.start = new Date(s.start)
    s.end = new Date(s.end)
    return s
  }) as LunarMonth[]

let months: LunarMonth[]
export const getMonths = (): LunarMonth[] => {
  if (months) return months
  try {
    return months = fromJson('./data/months.json')
  } catch {}
  const solarSeasons = getSeasons()
  const newMoons = readFileSync('./data/new-moons.txt', 'utf8')
    .trim()
    .split('\n')
    .map(d => new Date(d))
    .filter(d => d.getTime() >= 0)
  let whichMonth = 0
  let season = 0
  months = []
  for (let i = 0; i < newMoons.length - 1; i++) {
    const date = newMoons[i]
    if (!date) continue
    // only in the unix epoch!
    if (date.getTime() < 0) continue
    const start = new Date(
      `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`,
    )
    const next = newMoons[i + 1]
    if (!next) break
    const end = new Date(
      `${next.getUTCFullYear()}-${next.getUTCMonth() + 1}-${next.getUTCDate()}`,
    )

    // find the NEXT season. if it's Winter, and starts before this
    // moon ends, then this is January
    // otherwise, this is the next month
    let s = solarSeasons[season]
    //console.error(solarSeasons, s, season)
    if (!s) break
    while (s && s.date < start) {
      s = solarSeasons[++season]
    }
    if (!s) break
    if (s.date < end && s.name === 'winter') {
      whichMonth = 0
    } else {
      whichMonth = whichMonth + 1
    }
    const name = lunarMonthNames[whichMonth]
    if (!name) break
    months.push({
      name,
      start: date,
      end: next,
    })
  }
  writeFileSync(
    './data/months.json',
    JSON.stringify(months, null, 2) + '\n',
  )
  return months
}
