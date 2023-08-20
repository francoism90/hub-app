export const titleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\./g, ' ')
    .replace(/,/g, ', ')
    .replace(/-[\w+]/g, (match) => match.replace('-', ' '))
    .replace(/\b(\w)/g, (match) => match.toUpperCase())
    .replace(/\s\s+/g, ' ')
    .trim()
