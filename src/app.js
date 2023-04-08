export const handler = async (event, _context) => {
  // ... get data from event
  const { url } = event

  // ... run business logic
  const res = await fetch(url)
  console.info(`Status of ${url} : ${res.status}`)

  // ... return a result
  return res.status
}
