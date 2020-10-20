const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set storage engine
const storage = multer.diskStorage({
    destination: './public/upload/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-'+ Date.now() + path.extname(file.originalname));
    }
});

//Init Upload
const upload = multer({
    storage: storage,
    limits : {fileSize: 1000000},
    fileFilter : function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('profImage');

function  checkFileType(file, cb){
    //Allowed ext
    const fileTypes = /jpeg|jpg|png|gif/;
    //check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //Check mime type
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extname){
        return cb(null, true);
    }else {
        cb('Error: Images Only!');
    }

}

//Init app
const app = express();

//EJS
app.set('view engine', 'ejs');

//Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err){
            res.render('index',{
                msg: err
            });    
        } else {
            if(req.file == undefined){
                res.render('index', {
                    msg: 'Error: No file Selected!'
                });
            }
            else {
                res.render('index', {
                    msg: 'File uploaded!',
                    file: `upload/${req.file.filename}`
                });
            }
        }
    });
});



const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));