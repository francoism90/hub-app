import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

dayjs.extend(customParseFormat)
dayjs.extend(duration)
dayjs.extend(utc)

export const time = (value: any, format?: string) => {
  if (!value) return null

  return dayjs(parseFloat(value.toString()) * 1000)
    .utc()
    .format(format || 'HH:mm:ss')
    .replace(/^0(?:0:0?)?/, '')
}

export const date = (value: any, format?: string) => {
  if (!value) return null

  return dayjs(value.toString().replace(/[^a-z0-9]/gi, '-'), [
    'YYYY-MM-DD',
    'YYYY-MM',
    'MM-YYYY-DD',
    'MM-YY-DD',
    'YY-MM-DD',
    'YY-MM',
    'DD-MM-YYYY',
    'DD-MM-YY',
    'DD-MM',
    'D-M-YY',
    'D-M-YYYY',
    'YYYY MM DD',
    'YYYY MM',
    'MM YYYY DD',
    'MM YY DD',
    'YY MM DD',
    'YY MM',
    'DD MM YYYY',
    'DD MM YY',
    'DD MM',
    'D M YY',
    'D M YYYY'
  ]).format(format || 'D MMM YYYY')
}

export { dayjs }
