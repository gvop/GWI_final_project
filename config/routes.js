var     express = require('express')
var     router  = express.Router();

var contentController = require('../controllers/contentController');

router.route('/api')
  .get(contentController.contentsIndex)
 
module.exports = router;