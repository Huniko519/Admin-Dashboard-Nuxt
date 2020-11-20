export const generateId = (length: number = 16) => (
  Math.random().toString(length).substring(2, 15) + Math.random().toString(36).substring(2, 15)
)
