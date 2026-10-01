import { GravitationismDate } from './gravitationism-date.js'
console.log(new GravitationismDate(process.argv[2] ?? new Date()).toString())
