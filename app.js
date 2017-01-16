var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser =    require("body-parser");
var multer  =   require('multer');
var async = require('async');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

/*var storage =  multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './tmp/');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.svg');
  }  
});*/
var storage = multer.memoryStorage();

var upload = multer({ 
  storage : storage,
  fileFilter: function (req, file, callback) {
    callback(null, file.mimetype.startsWith('image/svg'));  
  }
 }).array('svgFile',10);

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.post('/', function(req, res) {  
  upload(req,res,function(err) {    
      if(err) {
          return res.end("Error uploading file.");
      }
      
      if (!req.files) {
        res.send('No files were uploaded.');
        return;
      }
      
      var results = req.files.map(function(f) {
        return {originalfilename: f.originalname, data: f.buffer.toString()}
      });
      
      res.render('index', { svgFile: results });   
      
      // async.map(
      //   req.files, 
      //   function(f, callback) {          
      //     fs.readFile(f.path, 'utf8', (err, data) => {
      //       callback(null,{path:f.path, originalfilename: f.originalname, data: data});
      //     });
      //   }, 
      //   function(err, results){
      //     res.render('index', { svgFile: results }, function(renderErr, html) {
      //       res.send(html);
            
      //       setTimeout(function() {                          
      //         async.each(results,function(f,cb) {
      //           fs.stat(f.path, function(xxe, stats) {
      //             if (stats.isFile()) {
      //               fs.unlink(f.path, function() {
      //                 cb();
      //               });
      //             }              
      //           });
      //         });
      //       },results.length*500);
      //     });                                          
      //   }
      // );      
  });
});

// app.get("/tmp/*",function(req,res){
//   res.sendFile(__dirname + req.path);
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
