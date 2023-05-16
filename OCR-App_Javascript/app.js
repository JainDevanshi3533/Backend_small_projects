
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const PDFDocument = require('pdfkit');
app.use(express.static('public'));
displayText={
    message:"",
    languageCode:'',
}

const worker = createWorker({
  logger: m => console.log(m)
});

// Storage for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).single('avatar');
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index',{displayText});
});

app.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      // Handle upload error
      return res.status(500).send('Upload failed');
    }

    try {
      const imageData = await fs.promises.readFile(`./uploads/${req.file.originalname}`);
      const languageCode = req.body.language; // Get the selected language code from the request body


      const worker = createWorker();
      await worker.load();
      await worker.loadLanguage(languageCode); // Load the selected language
      await worker.initialize(languageCode); // Initialize the selected language

      const { data } = await worker.recognize(imageData);
      console.log('Recognized text:', data.text);

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream('output.pdf'));
      doc.text(data.text);
      doc.end();

      await worker.terminate();


      console.log('PDF file saved successfully.');


        displayText.message= data.text;

      res.redirect('/');
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).send('Processing failed');
    }
  });
});

app.get('/download', (req, res) => {
  const file = `${__dirname}/output.pdf`;

  if(file){
   res.download(file, () => {
    console.log('PDF file downloaded successfully.');
  }); 
  }else{
    res.redirect('/');
  }
  
});
app.listen(5002, () => console.log('Server running on port 5002'));

