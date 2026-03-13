all: ics/solar-events.ics ics/months.ics

clean:
	rm -rf ics/* data/events.txt data/new-moons.txt data/*.json

ics/solar-events.ics: data/new-moons.txt data/events.txt
	npm --silent run solar-ics > ics/solar-events.ics

ics/months.ics: data/new-moons.txt data/events.txt
	npm --silent run lunar-ics > ics/months.ics

data/new-moons.txt: data/lunations.txt
	npm --silent run parse-lunar > data/new-moons.txt

data/events.txt: data/giss.txt data/russellcottrell.txt
	npm --silent run parse-solar > data/events.txt

.PHONY: clean ics
