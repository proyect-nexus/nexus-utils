import sharp from 'sharp';

export async function backGenerator(image, description) {
    const response = await axios.get(image, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'binary')
  
    const maxLineLength = 56
    const wrappedTitle = wrapText(description, maxLineLength)
    const wrappedImagins = wrapText(IMAGINS, maxLineLength)
  
    const htmlTitle = wrappedTitle
      .map((line, index) => {
        return `<text x="70" y="${15 + index * 3}%" font-family="Poppins" font-size="32" fill="black" text-anchor="start" dominant-baseline="middle">${line}</text>`
      })
      .join('\n')
  
    const htmlImagins = wrappedImagins
      .map((line, index) => {
        return `<text x="70" y="${20 + (index + wrappedTitle.length) * 3}%" font-family="Poppins" font-size="32" fill="black" text-anchor="start" dominant-baseline="middle">${line}</text>`
      })
      .join('\n')
  
    const htmlOverlay = `
      <svg width="1000" height="1250">
          <style>
                @font-face {
                  font-family: 'Poppins';
                  src: url(https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLGT9Z1JlFc-K.woff2) format('woff2');
                }
          </style>
          <filter id="blurFilter" x="0" y="0">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
          <rect x="35" y="140" width="900" height="${wrappedTitle.length * 50}" fill="white" fill-opacity="0.6" rx="15" ry="15"></rect>
          ${htmlTitle}
  
          <rect x="35" y="${140 + wrappedTitle.length * 50 + 25}" width="900" height="${wrappedImagins.length * 50}" fill="white" fill-opacity="0.6" rx="15" ry="15"></rect>
          ${htmlImagins}
      </svg>
    `
  
    const logoPath = path.join(process.cwd(), 'public', 'favicon.svg')
    const logoBuffer = fs.readFileSync(logoPath)
    const resizedLogoBuffer = await sharp(logoBuffer)
      .resize({ width: 70 })
      .toBuffer()
  
    const modifiedImage = await sharp(buffer)
      .resize(1000, 1250)
      .composite([
        {
          input: Buffer.from(htmlOverlay),
          gravity: 'north'
        },
        {
          input: resizedLogoBuffer,
          gravity: 'southwest',
          blend: 'over',
          top: 1160,
          left: 80
        }
      ])
      .toBuffer()
  
    return modifiedImage
}

// This is just to show how the function works.
// In a real scenario, this would be called by the server with actual image data.
console.log('processImage function is ready to use.');
console.log('It takes an image buffer and a title, and returns a processed image buffer.');
