
// Step 1 - set up express & mongoose
 
var express = require('express')

var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose')
 
var fs = require('fs');
var path = require('path');
require('dotenv/config');
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });

    app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
// Set EJS as templating engine
app.set("view engine", "ejs");

var multer = require('multer');
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });
// Step 6 - load the mongoose model for Image
var imgModel = require('./model');
// Step 7 - the GET request handler that provides the HTML UI
app.get('/edit', (req,res) => {
	res.render('edit',{imgModel : req._id});
})

app.get('/', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('imagesPage', { items: items });
		}
	});
});
// Step 8 - the POST handler for processing the uploaded file

// Step 8 - the POST handler for processing the uploaded file

// Step 8 - the POST handler for processing the uploaded file
app.get('/create',(req,res) => {
	res.render('uploadImg');
})
app.post('/', upload.single('image'), (req, res, next) => {
	var obj = {
		name: req.body.name,
		desc: req.body.desc,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/png'
		},		
		like : 0
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			// item.save();
			res.redirect('/');
		}
	});
});


app.delete('/delete/:id', async(req,res,next) => {
    try{
        imgModel.remove({_id : req.params.id},function(err,result){
            if(err){
                res.send(Err);
            }
            else{
                res.send(result);
            }
        })
    }
    catch(error){
        res.status(504).send(error);
    }
})


app.get('/delete/:id', function(req, res){
	console.log("lol");
	imgModel.remove({_id: req.params.id}, 
	   function(err){
	if(err) res.json(err);
	else    res.redirect('/');
	});
	});

	app.get('/edit/:id', function(req, res){
		console.log("edit");
		imgModel.remove({_id: req.params.id}, 
		   function(err){
		if(err) res.json(err);
		else    res.redirect('/edit');
		});
		});

// Step 9 - configure the server's port

var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})

