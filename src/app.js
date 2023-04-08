import { Logger } from '@aws-lambda-powertools/logger'

const logger = new Logger({ serviceName: 'httpCheck' })

export const handler = async (event, _context) => {
  logger.debug('Received event', { event })

  const { url } = event
  if (!url) {
    logger.error('Missing "url" in event')
    throw new Error('Missing "url" in event', { event })
  }

  logger.debug('Checking url', { url })

  try {
    const res = await fetch(url)
    logger.info('Url status', { url, status: res.status })
    return res.status
  } catch (err) {
    logger.error('Error checking url', { url, err })
    throw err
  }
}
