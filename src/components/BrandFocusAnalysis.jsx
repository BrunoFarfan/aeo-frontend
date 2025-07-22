import { 
  Box, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import { findBrandInList } from '../utils/brandNormalization'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line
} from 'recharts'

function BrandFocusAnalysis({ currentResult, similarPreviousResults, brand }) {
  if (!brand || !brand.trim()) return null

  const targetBrand = brand.trim()

  // Extract brand data from current results
  const currentBrandData = []
  const currentModelStats = {}
  
  if (currentResult) {
    Object.entries(currentResult).forEach(([model, results]) => {
      if (Array.isArray(results)) {
        const totalMentions = results.length
        const brandItem = findBrandInList(results, targetBrand)
        
        // Store model statistics
        currentModelStats[model] = {
          totalMentions,
          brandMentions: brandItem ? 1 : 0,
          brandMentionPercentage: brandItem ? (1 / totalMentions * 100) : 0
        }
        
        if (brandItem) {
          currentBrandData.push({
            model,
            position: brandItem.position,
            sentiment: brandItem.sentiment,
            linkCount: brandItem.link_count,
            totalMentions,
            brandMentionPercentage: (1 / totalMentions * 100)
          })
        }
      }
    })
  }

  // Extract brand data from historical results
  const historicalBrandData = []
  const historicalModelStats = {}
  const historicalAggregation = {
    totalMentions: 0,
    totalSentiment: 0,
    totalLinks: 0,
    positions: [],
    questions: new Set()
  }

  similarPreviousResults.forEach((historicalResult) => {
    if (historicalResult.processed_responses) {
      Object.entries(historicalResult.processed_responses).forEach(([model, results]) => {
        if (Array.isArray(results)) {
          const totalMentions = results.length
          const brandItem = findBrandInList(results, targetBrand)
          
          // Initialize model stats if not exists
          if (!historicalModelStats[model]) {
            historicalModelStats[model] = {
              totalMentions: 0,
              brandMentions: 0,
              brandMentionPercentage: 0
            }
          }
          
          historicalModelStats[model].totalMentions += totalMentions
          if (brandItem) {
            historicalModelStats[model].brandMentions += 1
            
            historicalBrandData.push({
              model,
              position: brandItem.position,
              sentiment: brandItem.sentiment,
              linkCount: brandItem.link_count,
              question: historicalResult.question,
              similarity: historicalResult.similarity_score,
              totalMentions,
              brandMentionPercentage: (1 / totalMentions * 100)
            })
            
            // Aggregate for summary
            historicalAggregation.totalMentions++
            historicalAggregation.totalSentiment += brandItem.sentiment
            historicalAggregation.totalLinks += brandItem.link_count
            historicalAggregation.positions.push(brandItem.position)
            historicalAggregation.questions.add(historicalResult.question)
          }
        }
      })
    }
  })

  // Calculate final percentages for historical data
  Object.keys(historicalModelStats).forEach(model => {
    if (historicalModelStats[model].totalMentions > 0) {
      historicalModelStats[model].brandMentionPercentage = 
        (historicalModelStats[model].brandMentions / historicalModelStats[model].totalMentions) * 100
    }
  })

  // Calculate historical averages
  const avgHistoricalPosition = historicalAggregation.positions.length > 0 
    ? historicalAggregation.positions.reduce((a, b) => a + b, 0) / historicalAggregation.positions.length
    : 0
  const avgHistoricalSentiment = historicalAggregation.totalMentions > 0 
    ? historicalAggregation.totalSentiment / historicalAggregation.totalMentions
    : 0
  const avgLinkCount = historicalAggregation.totalMentions > 0 
    ? historicalAggregation.totalLinks / historicalAggregation.totalMentions
    : 0

  // Prepare chart data
  const positionChartData = currentBrandData.map(item => ({
    model: item.model,
    position: item.position,
    sentiment: item.sentiment
  }))

  const sentimentChartData = currentBrandData.map(item => ({
    model: item.model,
    sentiment: item.sentiment,
    position: item.position
  }))

  // Historical trend data (if multiple historical entries)
  const historicalTrendData = historicalBrandData.length > 1 
    ? historicalBrandData
        .sort((a, b) => a.similarity - b.similarity)
        .map((item, index) => ({
          index: index + 1,
          position: item.position,
          sentiment: item.sentiment,
          similarity: (item.similarity * 100).toFixed(1)
        }))
    : []

  // Model comparison data for charts
  const modelComparisonData = Object.keys(historicalModelStats).map(model => ({
    model,
    mentionPercentage: historicalModelStats[model].brandMentionPercentage,
    totalMentions: historicalModelStats[model].totalMentions,
    brandMentions: historicalModelStats[model].brandMentions
  }))

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Análisis Enfocado: {brand}
      </Typography>

      {/* Current Results Section */}
      {currentBrandData.length > 0 && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'white' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Resultados Actuales por Modelo
          </Typography>
          
          {/* Table */}
          <TableContainer sx={{ mb: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Modelo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Posición</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sentimiento</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Enlaces</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>% Menciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentBrandData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {item.model}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: item.position <= 3 ? 'success.main' : 
                                   item.position <= 5 ? 'warning.main' : 
                                   item.position <= 10 ? 'info.main' : 'grey.400',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                      >
                        {item.position}
                      </Box>
                    </TableCell>
                    <TableCell>{(item.sentiment * 100).toFixed(1)}%</TableCell>
                    <TableCell>{item.linkCount}</TableCell>
                    <TableCell>{item.brandMentionPercentage.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Posición por Modelo
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={positionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="position" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Sentimiento por Modelo
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sentimentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sentiment" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Historical Analysis Section */}
      {historicalBrandData.length > 0 && (
        <Paper sx={{ p: 3, bgcolor: 'white' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Análisis Histórico por Modelo
          </Typography>

          {/* Model-specific tables */}
          {Object.keys(historicalModelStats).map(model => {
            const modelData = historicalBrandData.filter(item => item.model === model)
            const modelStats = historicalModelStats[model]
            
            if (modelData.length === 0) return null
            
            const avgPosition = modelData.reduce((sum, item) => sum + item.position, 0) / modelData.length
            const avgSentiment = modelData.reduce((sum, item) => sum + item.sentiment, 0) / modelData.length
            const avgLinks = modelData.reduce((sum, item) => sum + item.linkCount, 0) / modelData.length
            
            return (
              <Box key={model} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, textTransform: 'capitalize' }}>
                  {model}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {modelStats.brandMentions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Menciones de {brand}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {avgPosition.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Posición Promedio
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {(avgSentiment * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sentimiento Promedio
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {modelStats.brandMentionPercentage.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          % del Total de Menciones
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )
          })}

          {/* Overall Summary Cards */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
            Resumen General
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {historicalAggregation.totalMentions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Menciones Totales
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {avgHistoricalPosition.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Posición Promedio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {(avgHistoricalSentiment * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sentimiento Promedio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {avgLinkCount.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enlaces Promedio
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Model Comparison Chart */}
          {modelComparisonData.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Comparación por Modelo - % de Menciones
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={modelComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="model" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [value.toFixed(1) + '%', 'Porcentaje']} />
                  <Bar dataKey="mentionPercentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Historical Trend Chart */}
          {historicalTrendData.length > 1 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tendencia Histórica
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={historicalTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="position" stroke="#8884d8" name="Posición" />
                  <Line type="monotone" dataKey="sentiment" stroke="#82ca9d" name="Sentimiento" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>
      )}

      {/* No Data Message */}
      {currentBrandData.length === 0 && historicalBrandData.length === 0 && (
        <Paper sx={{ p: 3, bgcolor: 'white' }}>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No se encontraron datos para la marca "{brand}" en los resultados actuales o históricos.
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

export default BrandFocusAnalysis 