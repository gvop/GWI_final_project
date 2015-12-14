var express  = require('express');
var router   = express.Router();
var passport = require("passport");

var contentController = require('../controllers/contentController');
var usersController = require('../controllers/usersController');
var authenticationsController = require('../controllers/authenticationsController');

router.route('/api/content')
  .get(contentController.contentsIndex)

router.post('/api/login', authenticationsController.login);
router.post('/api/register', authenticationsController.register);

router.route('/api/users')
  .get(usersController.usersIndex)

router.route('/api/users/addcontent') 
  .post(usersController.addContent)
  .put(usersController.deleteContent) 

router.route('/api/users/:id')
  .get(usersController.usersShow)
  .put(usersController.usersUpdate)
  .patch(usersController.usersUpdate)
  .delete(usersController.usersDelete)

module.exports = router;