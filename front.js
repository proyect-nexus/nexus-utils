import sharp from 'sharp';

export async function frontGenerator(image, title, user, info) {
  const response = await axios.get(image, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, 'binary')

  const maxLineLength = 25
  const wrappedTitle = wrapText(title, maxLineLength)



  let htmlTitle
  let htmlAuthor

  if (info.position === 'bottom-center') {
    if (wrappedTitle.length === 1) {
      htmlTitle = `<text x="50%" y="80%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${wrappedTitle[0]}</text>`
      htmlAuthor = `<text x="50%" y="85%" font-family="Poppins" font-size="38" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${user.user_metadata.name || user.email}</text>`
    } else {
      htmlTitle = `
            <text x="50%" y="75%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${wrappedTitle[0]}</text>
            <text x="50%" y="80%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${wrappedTitle[1]}</text>
        `
      htmlAuthor = `<text x="50%" y="87%" font-family="Poppins" font-size="38" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${user.user_metadata.name || user.email}</text>`
    }
  } else {
    if (wrappedTitle.length === 1) {
      htmlTitle = `<text x="50%" y="15%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${wrappedTitle[0]}</text>`
      htmlAuthor = `<text x="50%" y="20%" font-family="Poppins" font-size="38" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${user.user_metadata.name || user.email}</text>`
    } else {
      htmlTitle = `
            <text x="50%" y="10%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${wrappedTitle[0]}</text>
            <text x="50%" y="15%" font-family="Poppins" font-size="62" font-weight="bold" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${wrappedTitle[1]}</text>
        `
      htmlAuthor = `<text x="50%" y="22%" font-family="Poppins" font-size="38" fill="${info.color}" text-anchor="middle" dominant-baseline="middle">${user.user_metadata.name || user.email}</text>`
    }
  }

  const logoPath = path.join(process.cwd(), 'public', 'favicon.svg')
  const logoBuffer = fs.readFileSync(logoPath)
  const resizedLogoBuffer = await sharp(logoBuffer)
    .resize({ width: 70 })
    .toBuffer()

  const modifiedImage = await sharp(buffer)
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
