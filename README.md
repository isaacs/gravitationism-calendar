A bit of JavaScript to create the
[Gravitationism](https://blog.izs.me/2025/10/church-of-gravitationism/)
[Solar](https://izs.me/solar-events.ics) and
[Lunar](https://izs.me/months.ics) calendars.

## How The Calendar Works

The year is broken up into 8 seasons, based on the position of
the earth around the sun:

- Winter (the start of the year)
- Imbolc
- Spring
- Beltane
- Summer
- Lughnasadh
- Autumn
- Samhain

These are about 44-48 days, because the earth moves in an
elliptical orbit, so the seasons closer to the aphelion (about 15

The months go from new moon to new moon. The month that includes
the winter solstice is "January", named for the two faced
backward/forward looking god of doorways and passages. (When
January starts _on_ the winter solstice, this is very
auspicious.)

From there, they are named from 1 to 11:

- Primember
- Duember
- Triember
- Fourember
- Pentember
- Sexember
- September
- October
- November
- December
- Elfember
- Lastly, when another month is needed in order for January to
  contain the winter solstice, the month of Fayember is added.
  This "leap month" occurs about every 2-3 years.

Because the lunar months don't line up with the year and seasons,
they are sort of "extra". Normal time keeping is done with the
number of the Gravitationism year (with G0 corresponding roughly
to CE 2024), running from one winter solstice to the next. For
example, the conventional ISO date 2026-03-13 would be written in
its short form as `G2-2-38`, or long form `Friday, G2 Imbolc 38,
Day 24 of Duember`.

Note that season dates are zero-indexed, and the first day of the
season is not given a number, so 2026-06-21 would be `G2-5-0` or
`Sunday, G2 Summer, Day 7 of Sexember`.

## ICS feeds

The ICS feeds are generated for use in the US/Pacific time zone.
For convenience, it makes the most sense to align with the solar
day, but technically the season doesn't actually start until the
moment of orbital alignment, so this can occur on different solar
days in different time zones.

If you're in the US/Pacific time zone, and want this data in your
calendar app, you can subscribe to these two calendar feeds:

- https://izs.me/solar-events.ics
- https://izs.me/months.ics

To generate the ICS feeds for your time zone if you're not in
US/Pacific, run:

```
npm install
make clean all
```

and then pull them out of the `./ics` folder.
