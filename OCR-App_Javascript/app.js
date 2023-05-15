const express = require('express');
const app= express();
const fs = require('fs');
const multer= require('multer');
const { createWorker} = require('tesseract.js');
 
const worker = createWorker({
  logger: m => console.log(m)
});

//storage for storing images 
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "./uploads");
    },
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
});
const upload=multer({storage:storage}).single("avatar");
app.set("view engine","ejs");


//routes
app.get('/', (req,res)=>{
    res.render('index');
})
app.post('/upload',(req,res)=>{
    upload(req,res,err=>{
        // console.log(req.file);
        fs.readFile(`./uploads/${req.file.originalname}`, (err, data)=>{
            if(err) return console.log(" Error in reading file",err);

            (async () => {
                await worker.load();
                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                const { data: { text } } = await worker.recognize(data);
                console.log(text);
                await worker.terminate();
                res.send(text);
                })();
            // worker
            // .recognize(data, "eng",{tessjs_create_pdf:"1"})
            // .progress(progress=>{
            //     console.log(progress);
            // }).then(result=>{
            //     res.send(result.text);
            // }).finally(()=>{
            //     worker.terminate();
            // })
        })
    })
})

app.listen(5002,()=>  console.log('server running on 5002'));

// const express = require('express');
// const app= express();
// const fs = require('fs');
// const multer= require('multer');
// const { createWorker } = require('tesseract.js');
// const worker = createWorker();

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
// app.post('/upload',(req,res)=>{
//     upload(req,res,err=>{
//         console.log(req.file);
//         // fs.readFile(`./uploads/${req.file.originalname}`, (err, data)=>{
//         //     if(err) return console.log(" Error in reading file");

//         //     (async () => {
//         //         await worker.load();
//         //         await worker.loadLanguage('eng');
//         //         await worker.initialize('eng');
//         //         const { data: { text } } = await worker.recognize(data);
//         //         console.log(text);
//         //         await worker.terminate();
//         //         res.send(text);
//         //     })();
//         // })
//     })
// })

// app.listen(5002,()=>  console.log('server running on 5002'));
