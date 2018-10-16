var express = require('express');
var app = express();
var path = require("path");
var ItemDB = require("./../models/ItemDB")

app.set('view engine', 'ejs');
app.use('/resource',express.static(path.join(__dirname,'/../resource')));
app.set('views', __dirname+'/../views');

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

app.get('/item/:id', function(req,res){
  console.log(req.query.id);
  var book = ItemDB.getItem(req.params.id);
  if(book.itemName === undefined){
    res.redirect('/categories');
  }else{
    res.render('item', {book: book});
  }
});

app.get('/item', function(req,res){
  var book = ItemDB.getItem(req.query.id);
  if(book.itemName === undefined){
    res.redirect('/categories');
  }else{
    res.render('item', {book: book});
  }
});

app.get('/myItems', function(req,res){id=
  res.render('myItems');
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

app.get('/swap/:id', function(req,res){
  var book = ItemDB.getItem(req.params.id);
  if(book.itemName === undefined){
      console.log(req.query.id);
    res.redirect('/categories');
  }else{
    res.render('swap', {book: book});
  }
});

app.get('/swap', function(req,res){
  var book = ItemDB.getItem(req.query.id);
  if(book.itemName === undefined){
    res.redirect('/categories');
  }else{
    res.render('swap', {book: book});
  }
});


app.get('*', function(req, res){
  res.send('Error');
});

app.listen(3000);
