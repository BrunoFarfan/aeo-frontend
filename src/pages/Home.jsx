import { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  CircularProgress
} from '@mui/material'
import { QuestionAnswer, Send } from '@mui/icons-material'

function Home() {
  const [question, setQuestion] = useState('')
  const [brand, setBrand] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('Question:', question)
    console.log('Brand:', brand)
    // Handle form submission here
    setTimeout(() => setIsSubmitting(false), 2000)
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
        </Paper>
      </Container>
    </Box>
  )
}

export default Home 