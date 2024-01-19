import { stringify } from 'https://deno.land/std@0.207.0/csv/mod.ts'

const main = async () => {
  // https://en.wikipedia.org/wiki/Dakar_Rally#Bikes
  const text = await Deno.readTextFile('data.txt')

  const lines: string[] = text.split('\n')

  const results: {
    year: number
    name: string
    country: string
    bike: string
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

        results.push({
          year,
          name,
          bike,
          country,
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
    columns: ['year', 'place', 'name', 'country', 'bike'],
  })

  await Deno.writeTextFile('results-v2.csv', csv)
}

main()
