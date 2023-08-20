import numbro from 'numbro'

export const average = (value?: number) => numbro(value).format({ average: true })

export { numbro }
