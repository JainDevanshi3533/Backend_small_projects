// const express = require('express');
// const app= express();
// const fs = require('fs');
// const multer= require('multer');
// const { createWorker} = require('tesseract.js');
 
// const worker = createWorker({
//   logger: m => console.log(m)
// });

// //storage for storing images 
// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null, "./uploads");
//     },
//     filename:(req,file,cb)=>{
//         cb(null, file.originalname);
//     }
// });
// const upload=multer({storage:storage}).single("avatar");
// app.set("view engine","ejs");


// //routes
// app.get('/', (req,res)=>{
//     res.render('index');
// })

// const PDFDocument = require('pdfkit');

// app.post('/upload', (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       // Handle upload error
//       return res.status(500).send('Upload failed');
//     }

//     try {
//       const imageData = await fs.promises.readFile(`./uploads/${req.file.originalname}`);

//       const worker = createWorker();
//       await worker.load();
//       await worker.loadLanguage('eng');
//       await worker.initialize('eng');

//       const { data } = await worker.recognize(imageData);
//       console.log('Recognized text:', data.text);

//       const doc = new PDFDocument();
//       doc.pipe(fs.createWriteStream('output.pdf'));
//       doc.text(data.text);
//       doc.end();

//       await worker.terminate();

//       console.log('PDF file saved successfully.');

//     //   Send the recognized text and PDF file path as response
//       res.send({
//         text: data.text,
//         pdfPath: 'output.pdf'
//       });

//     res.redirect('/download');
//     } catch (error) {
//       console.error('Error processing image:', error);
//       res.status(500).send('Processing failed');
//     }
//   });
// });

// app.get('/download',(req,res)=>{
//     const file = `${__dirname}/output.pdf`;
//     res.download(file);
// })

// app.listen(5002,()=>  console.log('server running on 5002'));

const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { createWorker } = require('tesseract.js');
const PDFDocument = require('pdfkit');
displayText={
    message:""
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

      const worker = createWorker();
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data } = await worker.recognize(imageData);
      console.log('Recognized text:', data.text);

      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream('output.pdf'));
      doc.text(data.text);
      doc.end();

      await worker.terminate();


      console.log('PDF file saved successfully.');

      // Send the recognized text and PDF file path as response
    //   res.send({
    //     text: data.text,
    //     pdfPath: 'output.pdf'
    //   });

        displayText= {
           message: data.text
        }
      res.redirect('/download');
    } catch (error) {
      console.error('Error processing image:', error);
      res.status(500).send('Processing failed');
    }
  });
});

app.get('/download', (req, res) => {
  const file = `${__dirname}/output.pdf`;
  res.download(file);
  res.redirect('/');
});

app.listen(5002, () => console.log('Server running on port 5002'));
