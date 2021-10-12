const mysql = require('mysql');

require('dotenv').config();


// Connection Pool
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//connect to database
connection.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
  });


// View games
exports.view_all_games = (req, res) => {
    let sql = "SELECT * FROM game";
    let query = connection.query(sql, (err, rows) => {
    if(err) throw err;
    res.render('index',{ rows: rows, message: req.flash('add_message'), message: req.flash('upload_message') });
  });
}


// Insert games
exports.save_game = (req, res) => {
	const { g_title, g_publisher, g_price} = req.body;

    // User the connection
	connection.query('INSERT INTO game SET game_title = ?, game_publisher = ?, game_price = ?', 
	[g_title, g_publisher, g_price], (err, rows) => {
		
		if (!err) {
		req.flash('add_message', `${g_title} has been added.`);
		res.redirect('/');
		} else {
		console.log(err);
		}
		console.log('The data from user table: \n', rows);
	});

}


// Update games
exports.update_game = (req, res) => {
  let sql = "UPDATE game SET game_title='"+req.body.game_title+"', game_publisher='"+req.body.game_publisher+"' , game_price='"+req.body.game_price+"' WHERE id ="+req.body.id;
  let query = connection.query(sql, (err, rows) => {
    if(err) throw err;
    res.redirect('/');
  });

}





