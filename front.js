import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

function wrapText (text, maxLength) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })

  if (currentLine) lines.push(currentLine)
  return lines
}

export async function frontGenerator(inputBuffer, title, user, info) {
  const maxLineLength = 25
  const wrappedTitle = wrapText(title, maxLineLength)

  let htmlTitle
  let htmlAuthor
  let textAnchor, xPosition

  switch (info.position) {
    case 'top-left':
      textAnchor = 'start'
      xPosition = '7%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="12%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="19%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="8%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="14%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="21%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'top-right':
      textAnchor = 'end'
      xPosition = '95%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="12%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="19%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="8%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="14%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="21%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'top-center':
      textAnchor = 'middle'
      xPosition = '50%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="12%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="19%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="8%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="14%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="21%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'bottom-left':
      textAnchor = 'start'
      xPosition = '7.5%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="85%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="90%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="80%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="85%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="90%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'bottom-right':
      textAnchor = 'end'
      xPosition = '95%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="85%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="92%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="82%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="88%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="94%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'center':
      textAnchor = 'middle'
      xPosition = '50%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="50%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="57%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="46%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="52%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="59%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'bottom-center':
    default:
      textAnchor = 'middle'
      xPosition = '50%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="85%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="92%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="82%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="88%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="94%" font-family="Poppins" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
  }

  const logoPath = path.join(process.cwd(), 'public', 'favicon.svg')
  const logoBuffer = fs.readFileSync(logoPath)
  const resizedLogoBuffer = await sharp(logoBuffer)
    .resize({ width: 70 })
    .toBuffer()

  const modifiedImage = await sharp(inputBuffer)
    .resize(1000, 1250)
    .composite([
      {
        input: Buffer.from(`<svg width="1000" height="1250">
                    <style>
                          @font-face {
                            font-family: 'Poppins';
                            src: url(https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLGT9Z1JlFc-K.woff2) format('woff2');
                          }
                    </style>
                    ${htmlTitle}
                    ${htmlAuthor}
                </svg>`),
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
