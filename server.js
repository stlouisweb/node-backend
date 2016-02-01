var mongoose = require('mongoose'),
		path = require('path'),
		bodyParser = require('body-parser'),
		express = require('express');
var app = express();

mongoose.connect('mongodb://192.168.99.100/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var commentSchema = mongoose.Schema({
	author: String,
	text: String
},{versionKey: false})

var Comment = mongoose.model('Comment', commentSchema);

app.set('port', (9000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/comments', function(req, res) {
	Comment.find(function (err, comments) {
	  if (err) return console.error(err);
		for (i = 0; i < comments.length; i++) {
			var comment = comments[i];
			delete comment['__v'];
			console.log(comment);
		}
		res.json(comments);
	})
});

app.post('/api/comments', function(req, res) {
  var newComment = new Comment ({
    author: req.body.author,
    text: req.body.text,
  });
	newComment.save(function (err, newComment) {
	  if (err) return console.error(err);
	});
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
