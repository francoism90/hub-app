import pino from 'pino'

export const logger = pino({
  name: 'app',
  enabled: import.meta.env.DEV
})
