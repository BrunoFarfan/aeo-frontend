/**
 * Hook for making similar questions requests to the backend
 * @param {string} question - The question to find similar ones for
 * @param {string} brand - The brand to analyze (optional)
 * @returns {Promise<Object>} - Returns similar_previous_results
 */
export const similarQuestions = async (question, brand = '') => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const response = await fetch(`${backendUrl}/similar_questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        brand: brand
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      similar_previous_results: data.similar_previous_results
    };
  } catch (error) {
    console.error('Error making similar questions query:', error);
    throw error;
  }
}; 