var express = require('express');
var path = require('path');
const webpack = require("webpack")
const config = require("./webpack.config.js")
const webpackHotMiddleware = require('webpack-hot-middleware')
const bodyParser = require('body-parser');

const compiler = webpack(config)
 const webpackDevMiddleware = require("webpack-dev-middleware")(
    compiler,
    config.devServer
  );
const server = express();
 server.use(bodyParser.json({
    limit: '10mb'
  }));
  server.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
  }));

  server.use(webpackHotMiddleware(compiler))
server.use(webpackDevMiddleware)
const indexPath = path.join(__dirname, 'index.html');
   // const publicPath = express.static(path.join(__dirname, '/dist'));

    //server.use('/dist', publicPath);
    //server.get('/', function (_, res) { res.sendFile(indexPath) });
 //    server.get('/*', function (req, res, next) {
	//     req.url = 'index.html';
	//     next('route');
	// });
	server.use(require('webpack-dev-middleware')(compiler, {
		  noInfo: false,
		  publicPath: '/'
		}));

	server.use('*', function (req, res, next) {	
	  var filename = path.join(__dirname,'index.html');
	  compiler.outputFileSystem.readFile(filename, function(err, result){
	    if (err) {
	      console.log(err);
	    }
	    console.log(req);
	    res.set('content-type','text/html');
	    res.setHeader("Access-Control-Allow-Origin", "*");
	    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, If-Modified-Since,cache-control");
	    res.setHeader("Access-Control-Allow-Credentials", true);
	    res.send(result);
	    res.end();
	  });
	});
server.listen(process.env.PORT || 3030);