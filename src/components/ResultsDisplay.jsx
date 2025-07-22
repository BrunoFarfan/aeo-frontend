import { 
  Box, 
  Typography, 
  Paper,
  Tabs,
  Tab
} from '@mui/material'

function ResultsDisplay({ 
  currentResult, 
  similarPreviousResults, 
  activeResultsTab, 
  onResultsTabChange,
  searchSimilarQuestions = false
}) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Resultados de IA
      </Typography>
      
      <Paper sx={{ bgcolor: 'grey.50' }}>
        <Tabs 
          value={activeResultsTab} 
          onChange={onResultsTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {!searchSimilarQuestions && <Tab label="Resultados Actuales" />}
          <Tab label="Resultados Anteriores" />
        </Tabs>

        {/* Current Results Tab */}
        {activeResultsTab === 0 && !searchSimilarQuestions && currentResult && (
          <Box sx={{ p: 3 }}>
            {typeof currentResult === 'object' ? (
              Object.entries(currentResult).map(([model, response]) => (
                <Paper key={model} sx={{ p: 3, mb: 2, bgcolor: 'white' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize' }}>
                    {model}
                  </Typography>
                                          {Array.isArray(response) && response.length > 0 ? (
                          response.map((item, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                mb: 2, 
                                p: 2, 
                                bgcolor: 'grey.50', 
                                borderRadius: 1,
                                border: '2px solid',
                                borderColor: item.position <= 3 ? 'success.main' : 
                                             item.position <= 5 ? 'warning.main' : 
                                             item.position <= 10 ? 'info.main' : 'grey.300'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    bgcolor: item.position <= 3 ? 'success.main' : 
                                             item.position <= 5 ? 'warning.main' : 
                                             item.position <= 10 ? 'info.main' : 'grey.400',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  {item.position}
                                </Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', flex: 1 }}>
                                  {item.brand}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Sentimiento: {item.sentiment}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Enlaces: {item.link_count}
                                </Typography>
                              </Box>
                            </Box>
                          ))
                        ) : (
                    <Typography variant="body1" color="text.secondary">
                      No hay resultados disponibles
                    </Typography>
                  )}
                </Paper>
              ))
            ) : (
              <Paper sx={{ p: 3, bgcolor: 'white' }}>
                <Typography variant="body1">
                  {currentResult}
                </Typography>
              </Paper>
            )}
          </Box>
        )}

        {/* Previous Results Tab */}
        {(activeResultsTab === 1 || (searchSimilarQuestions && activeResultsTab === 0)) && similarPreviousResults && similarPreviousResults.length > 0 && (
          <Box sx={{ p: 3, maxHeight: '400px', overflow: 'auto' }}>
            {similarPreviousResults.map((result, index) => (
              <Paper key={index} sx={{ p: 3, mb: 2, bgcolor: 'white' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Pregunta: {result.question}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Similitud: {(result.similarity_score * 100).toFixed(1)}%
                </Typography>
                {result.processed_responses && typeof result.processed_responses === 'object' ? (
                  Object.entries(result.processed_responses).map(([model, response]) => (
                    <Box key={model} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize' }}>
                        {model}
                      </Typography>
                                              {Array.isArray(response) && response.length > 0 ? (
                          response.map((item, itemIndex) => (
                            <Box 
                              key={itemIndex} 
                              sx={{ 
                                mb: 1, 
                                p: 1, 
                                bgcolor: 'grey.50', 
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: item.position <= 3 ? 'success.main' : 
                                             item.position <= 5 ? 'warning.main' : 
                                             item.position <= 10 ? 'info.main' : 'grey.300'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    bgcolor: item.position <= 3 ? 'success.main' : 
                                             item.position <= 5 ? 'warning.main' : 
                                             item.position <= 10 ? 'info.main' : 'grey.400',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  {item.position}
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                                  {item.brand}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, ml: 3 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Valoración (-1 a 1): {item.sentiment}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Links: {item.link_count}
                                </Typography>
                              </Box>
                            </Box>
                          ))
                        ) : (
                        <Typography variant="body2" color="text.secondary">
                          No hay resultados
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">
                    {result}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ResultsDisplay 