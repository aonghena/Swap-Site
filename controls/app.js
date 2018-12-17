var express = require('express');
var app = express();
var path = require("path");
var ItemDB = require(__dirname+"/../models/ItemDB")
var UserDB = require(__dirname+"/../models/UserDB")

app.set('view engine', 'ejs');
app.use('/resource',express.static(path.join(__dirname,'/../resource')));
app.set('/views', 'views');
const { check, validationResult } = require('express-validator/check');

var ProfileController = require(path.join(__dirname,"/ProfileController"));

app.use(ProfileController);

const { sanitizeBody } = require('express-validator/filter');
var validator = require('validator');

//secure HTTP Headers using helmet
var helmet = require('helmet');

app.use(helmet());

/**
 * The main controller
 */


app.get('/', function(req,res){
  res.render('index');
});
app.get('/index', function(req,res){
  res.render('index');
});

app.get('/categories', function(req,res){
  var books = ItemDB.getItems();
  res.render('categories', {books: books});
});

/**
 * get request for specific item using the id.
 * Validates the id and then output with sanitization
 */
app.post('/item/*', function(req,res){
  console.log("ttsts")
  var books = ItemDB.getItems();
  res.redirect('categories')
});


app.get('/item/:id',[check('id').isAlphanumeric()],async function(req,res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log("validation bad");
    res.redirect('/categories');
  }else{
  var book = await ItemDB.getItem(req.params.id);
  if(book === null){
    res.redirect('/categories');
  }else{
    //Output sanitization  
    book.id = escape(book.id) ;
    book.itemCode = escape(book.itemCode);
    book.catalogCategory = validator.blacklist(book.catalogCategory, "<>");
    book.author = validator.blacklist(book.author, "<>;//");
    book.des =  validator.blacklist(book.des, "<>");
    book.rating = validator.blacklist(book.rating, "<>");
    res.render('item', {book: book});
  }
}});

/**
 * get request for specific item using the id.
 * Validates the id and then output with sanitization
 */
app.get('/item',[sanitizeBody('id').toString()], async function(req,res){
const errors = validationResult(req);
if(!errors.isEmpty()){
  console.log("validation bad");
  res.redirect('/categories');
}else{
var book = await ItemDB.getItem(req.query.id);
if(book === null){
  res.redirect('/categories');
}else{
    //Output sanitization  
    book.id = escape(book.id) ;
    book.itemCode = escape(book.itemCode);
    book.catalogCategory = validator.blacklist(book.catalogCategory, "<>");
    book.author = validator.blacklist(book.author, "<>;//");
    book.des =  validator.blacklist(book.des, "<>");
    book.rating = validator.blacklist(book.rating, "<>");
  
  res.render('item', {book: book});
}
}
});

app.get('/myItems', function(req,res){
  loggedin = true; 
res.render('myItems', {loggedin : loggedin});
});

app.get('/about', function(req,res){
res.render('about');
});

app.get('/contact', function(req,res){
res.render('contact');
});

app.get('/mySwaps', function(req,res){
res.render('mySwaps');
});

app.get('/signin', function(req,res){
  res.render('login', {message: ""});
  });

app.get('/register', function(req,res){
  res.render('Register');
});

/**
 * gets request for swap item. 
 * gets and validates the item id and use it to generate swap input.
 */
app.get('/swap/:id',[sanitizeBody('id').toString()], function(req,res){
var book = ItemDB.getItem(req.params.id);
if(book.itemName === undefined){
  res.redirect('/categories');
}else{
  loggedin = req.session.user; 
  res.render('swap', {book: book, loggedin: loggedin});
}
});

/**
 * gets request for swap item. 
 * gets and validates the item id and use it to generate swap input.
 */
app.get('/swap', [sanitizeBody('id').toString()],function(req,res){
var book = ItemDB.getItem(req.query.id);
if(book.itemName === undefined){
  res.redirect('/categories');
}else{
  res.render('swap', {book: book});
}
});

/**
 * Error handling
 */
app.get('*', function(req, res){
res.send('Error');
});

app.listen(3000);
