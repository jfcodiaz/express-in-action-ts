export default (str: any): string => {
  const firstLetter = str.charAt(0).toUpperCase()
  const rest = str.slice(1).toLowerCase()
  return (firstLetter as string) + (rest as string)
}
