import { 
  Box, 
  Typography, 
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Color palette for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B', '#4ECDC4', '#45B7D1']

function BrandAggregation({ brandAggregation, chartData, activeTab, onTabChange, searchSimilarQuestions = false }) {
  if (!brandAggregation) return null

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Análisis de Marcas Mencionadas
      </Typography>

      <Paper sx={{ bgcolor: 'grey.50' }}>
        <Tabs value={activeTab} onChange={onTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Gráficos" />
          <Tab label="Tablas" />
        </Tabs>

        {/* Tab Panel for Charts */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Current Results Pie Chart - Only show when not searching similar questions */}
            {!searchSimilarQuestions && chartData.current.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Resultados Actuales - Distribución de Menciones
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.current}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.current.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Menciones']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Historical Results Pie Chart - Show for both modes */}
            {chartData.historical.length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {searchSimilarQuestions 
                    ? "Preguntas Similares - Distribución de Menciones"
                    : "Resultados Históricos - Distribución de Menciones"
                  }
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.historical}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.historical.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Menciones']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Box>
        )}

        {/* Tab Panel for Tables */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Current Results Table - Only show when not searching similar questions */}
            {!searchSimilarQuestions && Object.keys(brandAggregation.current.counts).length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Resultados Actuales - Detalle por Modelo
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Marca</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Modelos</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Menciones</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Posición Promedio</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Sentimiento Promedio</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Enlaces Totales</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(brandAggregation.current.counts)
                        .map(([brandName, count]) => {
                          const details = brandAggregation.current.details[brandName]
                          const avgPosition = details.positions.length > 0 
                            ? (details.positions.reduce((a, b) => a + b, 0) / details.positions.length)
                            : 0
                          const avgSentiment = details.totalSentiment / details.totalMentions
                          return {
                            brandName,
                            count,
                            avgPosition,
                            avgSentiment,
                            totalLinks: details.totalLinks,
                            models: Array.from(details.models).join(', ')
                          }
                        })
                        .sort((a, b) => a.avgPosition - b.avgPosition) // Sort by average position (best first)
                        .map(({ brandName, count, avgPosition, avgSentiment, totalLinks, models }) => (
                          <TableRow key={brandName}>
                            <TableCell sx={{ fontWeight: 600 }}>{brandName}</TableCell>
                            <TableCell>{models}</TableCell>
                            <TableCell>{count}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: avgPosition <= 3 ? 'success.main' : 
                                           avgPosition <= 5 ? 'warning.main' : 
                                           avgPosition <= 10 ? 'info.main' : 'grey.400',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {avgPosition.toFixed(1)}
                              </Box>
                            </TableCell>
                            <TableCell>{(avgSentiment * 100).toFixed(1)}%</TableCell>
                            <TableCell>{totalLinks}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Historical Results Table - Show for both modes */}
            {Object.keys(brandAggregation.historical.counts).length > 0 && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  {searchSimilarQuestions 
                    ? "Preguntas Similares - Análisis Agregado"
                    : "Resultados Históricos - Análisis Agregado"
                  }
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Marca</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Posición Promedio</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Menciones Totales</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Sentimiento Promedio</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Enlaces Totales</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Preguntas Relacionadas</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(brandAggregation.historical.counts)
                        .map(([brandName, count]) => {
                          const details = brandAggregation.historical.details[brandName]
                          const avgSentiment = details.totalSentiment / details.totalMentions
                          // Calculate actual average position from historical data
                          const avgPosition = details.positions.length > 0 
                            ? (details.positions.reduce((a, b) => a + b, 0) / details.positions.length)
                            : 0
                          return {
                            brandName,
                            count,
                            avgPosition,
                            avgSentiment,
                            totalLinks: details.totalLinks,
                            questionsCount: details.questions.size
                          }
                        })
                        .sort((a, b) => a.avgPosition - b.avgPosition) // Sort by average position (best first)
                        .map(({ brandName, count, avgPosition, avgSentiment, totalLinks, questionsCount }) => (
                          <TableRow key={brandName}>
                            <TableCell sx={{ fontWeight: 600 }}>{brandName}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: avgPosition <= 3 ? 'success.main' : 
                                           avgPosition <= 5 ? 'warning.main' : 
                                           avgPosition <= 10 ? 'info.main' : 'grey.400',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.9rem'
                                }}
                              >
                                {avgPosition.toFixed(1)}
                              </Box>
                            </TableCell>
                            <TableCell>{count}</TableCell>
                            <TableCell>{(avgSentiment * 100).toFixed(1)}%</TableCell>
                            <TableCell>{totalLinks}</TableCell>
                            <TableCell>{questionsCount}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default BrandAggregation 