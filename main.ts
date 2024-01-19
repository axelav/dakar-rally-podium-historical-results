import { stringify } from 'https://deno.land/std@0.207.0/csv/mod.ts'

const countryCodeMap: Record<string, string> = {
  FRA: 'France',
  ESP: 'Spain',
  ITA: 'Italy',
  USA: 'United States',
  AUS: 'Australia',
  CHI: 'Chile',
  POR: 'Portugal',
  GBR: 'United Kingdom',
  AUT: 'Austria',
  BEL: 'Belgium',
  RSA: 'South Africa',
  ARG: 'Argentina',
  NOR: 'Norway',
  SVK: 'Slovakia',
}

const main = async () => {
  // https://en.wikipedia.org/wiki/Dakar_Rally#Bikes
  const text = await Deno.readTextFile('data/wikipedia-data.txt')

  const lines: string[] = text.split('\n')

  const results: {
    year: number
    name: string
    country: string
    manufacturer: string
    model: string
    place: number
  }[] = []

  let year = 0
  let place = 1

  for (const line of lines) {
    if (line.includes('|align=center')) {
      year = parseInt(line.split('|')[3])
    }

    if (line.includes('flagicon')) {
      const regex = /\[\[(.*?)\]\]/g
      const regexResult = line.match(regex)

      if (regexResult) {
        const name = regexResult[0].substring(2, regexResult[0].length - 2)
        const bike = regexResult[1].substring(2, regexResult[1].length - 2)
        const country = line.split('|')[2].substring(0, 3)

        const bikeParts = bike.split(' ')
        let manufacturer = bikeParts[0]
        let model = bikeParts.slice(1).join(' ')

        if (bike.includes('Gas Gas')) {
          manufacturer = bikeParts.slice(0, 2).join(' ')
          model = bikeParts.slice(2).join(' ')
        }

        results.push({
          year,
          name,
          manufacturer,
          model,
          country: countryCodeMap[country],
          place,
        })

        place++
      }

      if (place === 4) {
        place = 1
      }
    }
  }

  const csv = stringify(results, {
    columns: ['year', 'place', 'name', 'country', 'manufacter', 'model'],
  })

  await Deno.writeTextFile('data/results.csv', csv)
}

main()
