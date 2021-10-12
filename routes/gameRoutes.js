const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');


// Routes
router.get('/', gameController.view_all_games);
router.post('/add-game', gameController.save_game);
router.post('/update-game', gameController.update_game);

  
module.exports = router;