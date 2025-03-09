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
  const maxLineLength = 20
  const wrappedTitle = wrapText(title, maxLineLength)
  const fontFamily = info.fontFamily || 'Poppins'

  const fontUrls = {
    'Poppins': {
      regular: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
      medium: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2',
      bold: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2'
    },
    'Playfair Display': {
      regular: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2',
      medium: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDX.woff2',
      bold: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiunDXbtM.woff2'
    },
    'Oswald': {
      regular: 'https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvsUZiZQ.woff2',
      medium: 'https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs18NvsUZiZQ.woff2',
      bold: 'https://fonts.gstatic.com/s/oswald/v49/TK3_WkUHHAIjg75cFRf3bXL8LICs1xZosUZiZQ.woff2'
    },
    'Lora': {
      regular: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.woff2',
      medium: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787zAvBJBkq0.woff2',
      bold: 'https://fonts.gstatic.com/s/lora/v32/0QI6MX1D_JOuGQbT0gvTJPa787z5vBJBkq0.woff2'
    },
    'Bebas Neue': {
      regular: 'https://fonts.gstatic.com/s/bebasneue/v9/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2',
      medium: 'https://fonts.gstatic.com/s/bebasneue/v9/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2',
      bold: 'https://fonts.gstatic.com/s/bebasneue/v9/JTUSjIg69CK48gW7PXoo9Wlhyw.woff2'
    },
    'Merriweather': {
      regular: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.woff2',
      medium: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.woff2',
      bold: 'https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZWMf6.woff2'
    },
    'Quicksand': {
      regular: 'https://fonts.gstatic.com/s/quicksand/v30/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58a-wg.woff2',
      medium: 'https://fonts.gstatic.com/s/quicksand/v30/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkM0o58a-wg.woff2',
      bold: 'https://fonts.gstatic.com/s/quicksand/v30/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkBgv58a-wg.woff2'
    },
    'Abril Fatface': {
      regular: 'https://fonts.gstatic.com/s/abrilfatface/v19/zOL64pLDlL1D99S8g8PtiKchq-dmjQ.woff2',
      medium: 'https://fonts.gstatic.com/s/abrilfatface/v19/zOL64pLDlL1D99S8g8PtiKchq-dmjQ.woff2',
      bold: 'https://fonts.gstatic.com/s/abrilfatface/v19/zOL64pLDlL1D99S8g8PtiKchq-dmjQ.woff2'
    },
    'Space Mono': {
      regular: 'https://fonts.gstatic.com/s/spacemono/v12/i7dPIFZifjKcF5UAWdDRYE98RWq7.woff2',
      medium: 'https://fonts.gstatic.com/s/spacemono/v12/i7dPIFZifjKcF5UAWdDRYE98RWq7.woff2',
      bold: 'https://fonts.gstatic.com/s/spacemono/v12/i7dMIFZifjKcF5UAWdDRaPpZUFqaHjyV.woff2'
    },
    'Dancing Script': {
      regular: 'https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup6.woff2',
      medium: 'https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BAyo3Sup6.woff2',
      bold: 'https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7B06U3Sup6.woff2'
    }
  }

  let htmlTitle
  let htmlAuthor
  let textAnchor, xPosition


  switch (info.position) {
    case 'top-left':
      textAnchor = 'start'
      xPosition = '7%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="12%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="19%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="8%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="14%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="21%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'top-right':
      textAnchor = 'end'
      xPosition = '95%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="12%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="19%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="8%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="14%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="21%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'top-center':
      textAnchor = 'middle'
      xPosition = '50%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="12%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="19%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}CC" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="8%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="14%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="21%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'bottom-left':
      textAnchor = 'start'
      xPosition = '7.5%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="85%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="90%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="80%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="85%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="90%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'bottom-right':
      textAnchor = 'end'
      xPosition = '95%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="85%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="92%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="82%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="88%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="94%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'center':
      textAnchor = 'middle'
      xPosition = '50%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="50%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="57%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="46%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="52%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="59%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
      break

    case 'bottom-center':
    default:
      textAnchor = 'middle'
      xPosition = '50%'
      if (wrappedTitle.length === 1) {
        htmlTitle = `<text x="${xPosition}" y="85%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="92%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      } else {
        htmlTitle = `
          <text x="${xPosition}" y="82%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[0]}</text>
          <text x="${xPosition}" y="88%" font-family="${fontFamily}" font-size="62" font-weight="bold" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${wrappedTitle[1]}</text>`
        htmlAuthor = `<text x="${xPosition}" y="94%" font-family="${fontFamily}" font-weight="500" font-size="38" fill="${info.color || '#000000'}" text-anchor="${textAnchor}" dominant-baseline="middle">${user}</text>`
      }
  }

  const logoPath = path.join(process.cwd(), 'public', 'favicon.svg')
  const logoBuffer = fs.readFileSync(logoPath)
  const resizedLogoBuffer = await sharp(logoBuffer)
    .resize({ width: 70 })
    .toBuffer()

  console.log(fontFamily)
  console.log(fontUrls[fontFamily])
  const modifiedImage = await sharp(inputBuffer)
    .resize(1000, 1250)
    .composite([
      {
        input: Buffer.from(`<svg width="1000" height="1250">
                    <style>
                          @font-face {
                            font-family: '${fontFamily}';
                            src: url(${fontUrls[fontFamily]?.regular || fontUrls['Poppins'].regular}) format('woff2');
                            font-weight: normal;
                          }
                          @font-face {
                            font-family: '${fontFamily}';
                            src: url(${fontUrls[fontFamily]?.medium || fontUrls['Poppins'].medium}) format('woff2');
                            font-weight: 500;
                          }
                          @font-face {
                            font-family: '${fontFamily}';
                            src: url(${fontUrls[fontFamily]?.bold || fontUrls['Poppins'].bold}) format('woff2');
                            font-weight: bold;
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

console.log('processImage function is ready to use.');
console.log('It takes an image buffer and a title, and returns a processed image buffer.');
