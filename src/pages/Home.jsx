import { useState } from 'react'
import { 
  Box, 
  Container, 
  Paper,
  Alert
} from '@mui/material'
import { deepQuery } from '../hooks/useDeepQuery'
import { similarQuestions } from '../hooks/useSimilarQuestions'
import { useBrandAggregation } from '../hooks/useBrandAggregation'
import QueryForm from '../components/QueryForm'
import ResultsDisplay from '../components/ResultsDisplay'
import BrandAggregation from '../components/BrandAggregation'

function Home() {
  const [question, setQuestion] = useState('')
  const [brand, setBrand] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentResult, setCurrentResult] = useState(null)
  const [similarPreviousResults, setSimilarPreviousResults] = useState([])
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [activeResultsTab, setActiveResultsTab] = useState(0)
  const [searchSimilarQuestions, setSearchSimilarQuestions] = useState(false)

  // Use custom hook for brand aggregation
  const { brandAggregation, chartData } = useBrandAggregation(currentResult, similarPreviousResults, brand)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleResultsTabChange = (event, newValue) => {
    setActiveResultsTab(newValue)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setInfoMessage('')
    setCurrentResult(null)
    setSimilarPreviousResults([])
    
    try {
      if (searchSimilarQuestions) {
        // Only search for similar questions without making the actual query
        const result = await similarQuestions(question, brand)
        setSimilarPreviousResults(result.similar_previous_results)
        // Automatically switch to focused analysis tab when brand is provided, otherwise previous results
        setActiveResultsTab(brand && brand.trim() ? 1 : 0)
        
        // Show message if no similar questions found but request was successful
        if (!result.similar_previous_results || result.similar_previous_results.length === 0) {
          setInfoMessage('No se encontraron preguntas similares en el historial. Intenta con una pregunta diferente o desactiva la búsqueda de preguntas similares.')
        }
      } else {
        // Make the full deep query
        const result = await deepQuery(question, brand)
        setCurrentResult(result.current_result)
        setSimilarPreviousResults(result.similar_previous_results)
      }
    } catch (err) {
      // Handle specific 404 error for similar questions
      if (searchSimilarQuestions && err.message && err.message.includes('404')) {
        setError('No se encontraron preguntas similares en el historial. Intenta con una pregunta diferente o desactiva la búsqueda de preguntas similares.')
      } else {
        setError('Error al procesar la pregunta. Por favor, intenta de nuevo.')
      }
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'white',
            width: '100%',
            maxWidth: '1200px'
          }}
        >
          {/* Query Form */}
          <QueryForm
            question={question}
            setQuestion={setQuestion}
            brand={brand}
            setBrand={setBrand}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            searchSimilarQuestions={searchSimilarQuestions}
            setSearchSimilarQuestions={setSearchSimilarQuestions}
          />

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {/* Info Message Display */}
          {infoMessage && (
            <Alert severity="info" sx={{ mt: 3 }}>
              {infoMessage}
            </Alert>
          )}

          {/* Results Display */}
          {(currentResult || (similarPreviousResults && similarPreviousResults.length > 0)) && (
            <ResultsDisplay
              currentResult={currentResult}
              similarPreviousResults={similarPreviousResults}
              activeResultsTab={activeResultsTab}
              onResultsTabChange={handleResultsTabChange}
              searchSimilarQuestions={searchSimilarQuestions}
              brand={brand}
            />
          )}

          {/* Brand Aggregation Analysis - Only show when no specific brand is provided */}
          {brandAggregation && similarPreviousResults && similarPreviousResults.length > 0 && !brand.trim() && (
            <BrandAggregation
              brandAggregation={brandAggregation}
              chartData={chartData}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              searchSimilarQuestions={searchSimilarQuestions}
            />
          )}


        </Paper>
      </Container>
    </Box>
  )
}

export default Home 