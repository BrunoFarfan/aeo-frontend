/**
 * Hook for making deep query requests to the backend
 * @param {string} question - The question to ask
 * @param {string} brand - The brand to analyze (optional)
 * @returns {Promise<Object>} - Returns current_result and similar_previous_results
 */
export const deepQuery = async (question, brand = '') => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    // const backendUrl = 'http://localhost:8000/api/v1'
    const response = await fetch(`${backendUrl}/deep_query`, {
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
      current_result: data.current_result,
      similar_previous_results: data.similar_previous_results
    };
  } catch (error) {
    console.error('Error making deep query:', error);
    throw error;
  }
}; 