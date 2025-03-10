import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

function escapeXML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

export async function backGenerator(inputBuffer, description, IMAGINS) {
  const maxLineLength = 56;
  const wrappedTitle = wrapText(description, maxLineLength);
  const wrappedImagins = wrapText(IMAGINS, maxLineLength);

  const htmlTitle = wrappedTitle
    .map((line, index) => {
      return `<text x="55" y="${175 + index * 50}" font-family="Poppins" font-size="28" font-weight="500" fill="black" text-anchor="start" dominant-baseline="middle">${escapeXML(line)}</text>`;
    })
    .join('\n');

  const htmlImagins = wrappedImagins
    .map((line, index) => {
      return `<text x="55" y="${185 + (wrappedTitle.length * 50) + 40 + (index * 50)}" font-family="Poppins" font-size="28" font-weight="500" fill="black" text-anchor="start" dominant-baseline="middle">${escapeXML(line)}</text>`;
    })
    .join('\n');

  const htmlOverlay = `
    <svg width="1000" height="1250" xmlns="http://www.w3.org/2000/svg">
        <style>
              @font-face {
                font-family: 'Poppins';
                src: url(https://fonts.gstatic.com/s/poppins/v22/pxiByp8kv8JHgFVrLGT9Z1JlFc-K.woff2) format('woff2');
                font-weight: 500;
              }
        </style>
        <filter id="blurFilter" x="0" y="0">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
        <rect x="40" y="135" width="900" height="${wrappedTitle.length * 60}" fill="white" fill-opacity="0.6" rx="15" ry="15"></rect>
        ${htmlTitle}

        <rect x="40" y="${140 + wrappedTitle.length * 50 + 45}" width="900" height="${wrappedImagins.length * 55}" fill="white" fill-opacity="0.6" rx="15" ry="15"></rect>
        ${htmlImagins}
    </svg>
  `;

  const logoPath = path.join(process.cwd(), 'public', 'favicon.svg');
  const logoBuffer = fs.readFileSync(logoPath);
  const resizedLogoBuffer = await sharp(logoBuffer)
    .resize({ width: 70 })
    .toBuffer();

  const modifiedImage = await sharp(inputBuffer)
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
        left: 30
      }
    ])
    .toBuffer();

  return modifiedImage;
}

