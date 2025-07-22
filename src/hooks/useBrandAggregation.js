import { useMemo } from 'react'
import { normalizeBrandName } from '../utils/brandNormalization'

export const useBrandAggregation = (currentResult, similarPreviousResults, brand) => {
  // Brand aggregation logic for when no specific brand is provided
  const brandAggregation = useMemo(() => {
    // Return null if no data to process (no current results and no similar previous results)
    // Also return null if a specific brand is provided (we'll show brand focus analysis instead)
    if ((!currentResult && (!similarPreviousResults || similarPreviousResults.length === 0)) || normalizeBrandName(brand)) return null

    const brandCounts = {}
    const brandDetails = {}

    // Process current results
    if (currentResult) {
      Object.entries(currentResult).forEach(([model, results]) => {
        if (Array.isArray(results)) {
          results.forEach((item) => {
            const brandName = item.brand
            if (!brandCounts[brandName]) {
              brandCounts[brandName] = 0
              brandDetails[brandName] = {
                totalMentions: 0,
                totalSentiment: 0,
                totalLinks: 0,
                models: new Set(),
                positions: []
              }
            }
            brandCounts[brandName]++
            brandDetails[brandName].totalMentions++
            brandDetails[brandName].totalSentiment += item.sentiment
            brandDetails[brandName].totalLinks += item.link_count
            brandDetails[brandName].models.add(model)
            brandDetails[brandName].positions.push(item.position)
          })
        }
      })
    }

    // Process similar previous results
    const historicalBrandCounts = {}
    const historicalBrandDetails = {}

    similarPreviousResults.forEach((historicalResult) => {
      if (historicalResult.processed_responses) {
        Object.entries(historicalResult.processed_responses).forEach(([model, results]) => {
          if (Array.isArray(results)) {
            results.forEach((item) => {
              const brandName = item.brand
              if (!historicalBrandCounts[brandName]) {
                historicalBrandCounts[brandName] = 0
                historicalBrandDetails[brandName] = {
                  totalMentions: 0,
                  totalSentiment: 0,
                  totalLinks: 0,
                  questions: new Set(),
                  positions: []
                }
              }
              historicalBrandCounts[brandName]++
              historicalBrandDetails[brandName].totalMentions++
              historicalBrandDetails[brandName].totalSentiment += item.sentiment
              historicalBrandDetails[brandName].totalLinks += item.link_count
              historicalBrandDetails[brandName].questions.add(historicalResult.question)
              historicalBrandDetails[brandName].positions.push(item.position)
            })
          }
        })
      }
    })

    return {
      current: {
        counts: brandCounts,
        details: brandDetails
      },
      historical: {
        counts: historicalBrandCounts,
        details: historicalBrandDetails
      }
    }
  }, [currentResult, similarPreviousResults, brand])

  // Prepare chart data for pie charts with limit and grouping
  const chartData = useMemo(() => {
    if (!brandAggregation) return { current: [], historical: [] }

    const processData = (data, maxEntries = 5, dataType = 'current') => {
      // Sort by count (descending) and take top entries
      const sortedEntries = Object.entries(data)
        .sort(([,a], [,b]) => b - a)
        .slice(0, maxEntries)
      
      const topEntries = sortedEntries.map(([brand, count]) => ({
        name: brand,
        value: count,
        type: dataType
      }))

      // Calculate total for remaining entries
      const remainingEntries = Object.entries(data)
        .sort(([,a], [,b]) => b - a)
        .slice(maxEntries)
      
      const remainingTotal = remainingEntries.reduce((sum, [, count]) => sum + count, 0)

      // Add "Otros" entry if there are remaining entries
      if (remainingTotal > 0) {
        topEntries.push({
          name: 'Otros',
          value: remainingTotal,
          type: dataType
        })
      }

      return topEntries
    }

    const currentData = processData(brandAggregation.current.counts, 5, 'current')
    const historicalData = processData(brandAggregation.historical.counts, 5, 'historical')

    return { current: currentData, historical: historicalData }
  }, [brandAggregation])

  return { brandAggregation, chartData }
} 