import { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material'
import { QuestionAnswer, Send } from '@mui/icons-material'
import { deepQuery } from '../hooks/useDeepQuery'

function Home() {
  const [question, setQuestion] = useState('')
  const [brand, setBrand] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentResult, setCurrentResult] = useState(null)
  const [similarPreviousResults, setSimilarPreviousResults] = useState([])
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setCurrentResult(null)
    setSimilarPreviousResults([])
    
    try {
      const result = await deepQuery(question, brand)
      setCurrentResult(result.current_result)
      setSimilarPreviousResults(result.similar_previous_results)
    } catch (err) {
      setError('Error al procesar la pregunta. Por favor, intenta de nuevo.')
      console.error('Error submitting form:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'white'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <QuestionAnswer 
              sx={{ 
                fontSize: 48, 
                color: 'primary.main',
                mb: 2
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Haz Tu Pregunta
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
            >
              Obtén análisis de AEO de tu marca
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tu Pregunta"
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              sx={{ mb: 3 }}
              placeholder="¿Qué te gustaría saber?"
            />

            <TextField
              fullWidth
              label="Marca para analizar (Opcional)"
              variant="outlined"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              sx={{ mb: 4 }}
              placeholder="Ingresa el nombre de la marca..."
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting || !question.trim()}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Send />
                )
              }
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Procesando...' : 'Hacer Pregunta'}
            </Button>
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {/* Results Display */}
          {currentResult && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Resultados de IA
              </Typography>
              {typeof currentResult === 'object' ? (
                Object.entries(currentResult).map(([model, response]) => (
                  <Paper key={model} sx={{ p: 3, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize' }}>
                      {model}
                    </Typography>
                    {Array.isArray(response) && response.length > 0 ? (
                      response.map((item, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {item.brand}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Posición: {item.position}
                            </Typography>
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
                <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {currentResult}
                  </Typography>
                </Paper>
              )}
            </Box>
          )}

          {/* Similar Previous Results */}
          {similarPreviousResults && similarPreviousResults.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Resultados Similares Anteriores
              </Typography>
              {similarPreviousResults.map((result, index) => (
                <Paper key={index} sx={{ p: 3, mb: 2, bgcolor: 'grey.50' }}>
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
                            <Box key={itemIndex} sx={{ mb: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.brand}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Pos: {item.position}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Sent: {item.sentiment}
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
      </Container>
    </Box>
  )
}

export default Home 