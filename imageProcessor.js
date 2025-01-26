import sharp from 'sharp';

export async function processImage(inputBuffer, title) {
  try {
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    const width = metadata.width;
    const height = metadata.height;

    const svgBuffer = Buffer.from(`
      <svg width="${width}" height="${height}">
        <style>
          .title { fill: white; font-size: 40px; font-weight: bold; }
        </style>
        <text x="50%" y="50" text-anchor="middle" class="title">${title}</text>
      </svg>
    `);

    return await image
      .composite([
        {
          input: svgBuffer,
          top: 0,
          left: 0,
        },
      ])
      .jpeg()
      .toBuffer();
  } catch (error) {
    console.error('Error in processImage:', error);
    throw error;
  }
}

// This is just to show how the function works.
// In a real scenario, this would be called by the server with actual image data.
console.log('processImage function is ready to use.');
console.log('It takes an image buffer and a title, and returns a processed image buffer.');
