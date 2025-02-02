import express from 'express';
import multer from 'multer';
import { frontGenerator } from './front.js';
import { backGenerator } from './back.js';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.status(200).send('Server running');
});

app.post('/process-image-front', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image file uploaded');
    }

    const title = req.body.title || 'Default Title';
    const processedImageBuffer = await frontGenerator(req.file.buffer, title, req.body.user, JSON.parse(req.body.info));

    res.set('Content-Type', 'image/jpeg');
    res.send(processedImageBuffer);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

app.post('/process-image-back', upload.single('image'), async (req, res) => {
  try {
    const processedImageBuffer = await backGenerator(req.file.buffer, req.body.description, req.body.IMAGINS);
    res.set('Content-Type', 'image/jpeg');
    res.send(processedImageBuffer);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Error processing image');
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Simulate server start and a sample request
console.log('Server started. Simulating a request...');

// This is just to simulate how you might use the endpoint.
// In a real scenario, you would send a POST request to this endpoint
// with an actual image file and a title in the body.
console.log('POST /process-image');
console.log('Body: { title: "Sample Title" }');
console.log('File: [image data]');
console.log('Response: [processed image data]');
