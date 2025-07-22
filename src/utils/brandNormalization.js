// Utility function to normalize brand names for comparison
export const normalizeBrandName = (brandName) => {
  if (!brandName) return ''
  
  return brandName
    .toLowerCase()
    .normalize('NFD') // Decompose characters with accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric characters
    .trim()
}

// Function to find a brand in a list using normalized comparison
export const findBrandInList = (brandList, targetBrand) => {
  const normalizedTarget = normalizeBrandName(targetBrand)
  
  return brandList.find(item => 
    normalizeBrandName(item.brand) === normalizedTarget
  )
} 