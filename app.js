const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');

const session = require('express-session');
const flash = require('connect-flash');

const multer = require('multer');


global.__basedir = __dirname;

// -> Multer Upload Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	   cb(null, __basedir + '/uploads/')
	},
	filename: (req, file, cb) => {
	   cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
	}
});

const upload = multer({storage: storage});


const gameRoutes = require('./routes/gameRoutes');

//use path module
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));


app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
  }));
  
app.use(flash());




// CSV Import =======================================================================================================


// -> Express Upload RestAPIs
app.post('/api/uploadfile', upload.single("uploadfile"), (req, res) =>{
	try {
        req.flash('upload_message', 'CSV import success');
        importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
        res.redirect('/');
        }
        catch (error) {
            next(error);
        }

});

// -> Import CSV File to MySQL database
function importCsvData2MySQL(filePath){
    let stream = fs.createReadStream(filePath);
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();
 
            // Create a connection to the database
            const connection = mysql.createConnection({
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              password: process.env.DB_PASS,
              database: process.env.DB_NAME
            });
 
            // Open the MySQL connection
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO game (id, game_title, game_publisher, game_price) VALUES ?';
                    connection.query(query, [csvData], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
			
			fs.unlinkSync(filePath)
        });
 
    stream.pipe(csvStream);
}
// CSV Import =======================================================================================================




// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));


// parse requests of content-type: application/json
app.use(express.json());



// Static Files
app.use(express.static('public'));


// Templating Engine
app.engine('hbs', exphbs( {
  extname: '.hbs' ,
  defaultLayout: false,
  layoutsDir: "views/"

  }));

app.set('view engine', 'hbs');


//Game routes
app.use('/',gameRoutes);






