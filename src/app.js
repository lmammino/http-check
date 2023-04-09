import { Logger } from '@aws-lambda-powertools/logger'
import { Metrics, MetricUnits } from '@aws-lambda-powertools/metrics'

const logger = new Logger({ serviceName: 'httpCheck' })
const metrics = new Metrics({ namespace: 'utils', serviceName: 'httpCheck' })

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
    const successMetric = metrics.singleMetric()
    successMetric.addDimension('status', String(res.status))
    successMetric.addMetric('successfulRequests', MetricUnits.Count, 1)
    metrics.addMetric(`successfulRequests${String(res.status)[0]}xx`, MetricUnits.Count, 1)
    metrics.publishStoredMetrics()
    return res.status
  } catch (err) {
    logger.error('Error checking url', { url, err })
    metrics.addMetric('FailedRequests', MetricUnits.Count, 1)
    metrics.publishStoredMetrics()
    throw err
  }
}
