const generateImageUrl = ({
  filename,
  format,
  option = 'q_auto,c_fill',
}: {
  filename: string
  format: 'jpg' | 'webp'
  option?: string
}) => {
  return `https://res.cloudinary.com/dozkdbzkh/image/upload/${option}/v1706204013/react-wedding/${format}/${filename}.${format}`
}

export default generateImageUrl
