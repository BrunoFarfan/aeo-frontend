import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material'
import { QuestionAnswer, Send } from '@mui/icons-material'

function QueryForm({ 
  question, 
  setQuestion, 
  brand, 
  setBrand, 
  isSubmitting, 
  onSubmit,
  searchSimilarQuestions,
  setSearchSimilarQuestions
}) {
  return (
    <Box>
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
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ maxWidth: '600px', width: '100%' }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tu Pregunta"
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="¿Qué te gustaría saber?"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Marca para analizar (Opcional)"
              variant="outlined"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ingresa el nombre de la marca..."
              sx={{ mb: 3 }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={searchSimilarQuestions}
                onChange={(e) => setSearchSimilarQuestions(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Buscar preguntas similares
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {searchSimilarQuestions 
                    ? "Solo buscará preguntas similares pasadas, sin hacer la consulta actual"
                    : "Hacer la consulta completa con análisis de IA"
                  }
                </Typography>
              </Box>
            }
            sx={{ 
              alignItems: 'flex-start',
              '& .MuiFormControlLabel-label': {
                mt: 0
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
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
              fontWeight: 600,
              maxWidth: '600px',
              width: '100%'
            }}
          >
            {isSubmitting 
              ? 'Procesando...' 
              : searchSimilarQuestions 
                ? 'Buscar Preguntas Similares' 
                : 'Hacer Pregunta'
            }
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default QueryForm 