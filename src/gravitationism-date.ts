// get the gravitationism calendar data for any iso date

import { type LunarMonth } from './months.ts'
import { seasonNumber, type SolarSeason } from './season.ts'
import { getSeasons } from './season.ts'
import { getMonths } from './months.ts'

const locday = (d: Date) =>
  new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`)

const findSeason = (d: Date, seasons = getSeasons()) => {
  if (!seasons.length) throw new Error('ran out of seasons??')
  const i = Math.floor(seasons.length / 2)
  const s = seasons[i]
  const sd = locday(s.date)
  if (sd.getTime() > d.getTime()) {
    return findSeason(d, seasons.slice(0, i))
  } else if (seasons.length === 1) {
    return s
  } else {
    return findSeason(d, seasons.slice(i))
  }
}

const DAY = 24 * 60 * 60 * 1000

const findMonth = (d: Date, months = getMonths()) => {
  if (!months.length) throw new Error('ran out of months??')
  const i = Math.floor(months.length / 2)
  const s = months[i]
  const md = locday(s.start)
  if (md.getTime() > d.getTime() + DAY) {
    return findMonth(d, months.slice(0, i))
  } else if (months.length === 1) {
    return s
  } else {
    return findMonth(d, months.slice(i))
  }
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const capitalize = (s: string) =>
  `${s.charAt(0).toUpperCase()}${s.slice(1)}`

export class GravitationismDate {
  /** the season this date falls in */
  season: SolarSeason
  /** the day within the season, zero-indexed */
  seasonDate: number
  /** gravitationism epoch year */
  year: number
  lunarMonth: LunarMonth
  lunarDate: number
  isoDate: Date
  fullString: string
  shortString: string

  toString() {
    return this.fullString
  }

  constructor(d: Date = new Date()) {
    const dd = d instanceof Date ? d : new Date(d)
    this.isoDate = dd
    const ld = locday(dd)
    const season = (this.season = findSeason(ld))
    const sd = season.date
    const locSD = locday(sd)
    const month = findMonth(dd)
    this.season = season
    this.year = season.gyear
    const cd = locday(dd)
    this.seasonDate = Math.round((cd.getTime() - locSD.getTime()) / DAY)
    if (isNaN(this.seasonDate))
      throw new Error('invalid date: out of range')

    // because we only calculate up through G76, that last January gets cut
    // off, so fake it.
    if (month.name === 'Elfember' && this.isoDate > month.end) {
      this.lunarMonth = {
        name: 'January',
        start: new Date('2100-12-01T13:02:00.000Z'),
        end: new Date(Date.parse('2100-12-01T13:02:00.000Z') + 29.5 * DAY),
      }
    } else {
      this.lunarMonth = month
    }
    const md = this.lunarMonth.start
    const locMD = locday(md)

    this.lunarDate = Math.round((cd.getTime() - locMD.getTime()) / DAY)

    if (isNaN(this.lunarDate))
      throw new Error('invalid date: out of range')
    this.shortString = `G${this.year}-${seasonNumber[this.season.name]}-${this.seasonDate}`
    const monthStr =
      this.season.name === 'winter' && this.lunarDate === 0 ?
        'Aligned January'
      : (this.lunarDate === 0 ? '' : 'Day ' + this.lunarDate + ' of ') +
        this.lunarMonth.name
    const seasonStr =
      capitalize(this.season.name) +
      (this.seasonDate ? ' ' + this.seasonDate : '')
    this.fullString = `${days[this.isoDate.getDay()]}, G${this.year} ${seasonStr}, ${monthStr}`
  }
}
