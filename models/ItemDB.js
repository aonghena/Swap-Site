function Book(itemCode, itemName, catalogCategory, author, des, rating, imageUrl) {
  this.itemCode = itemCode;
  this.itemName = itemName;
  this.catalogCategory = catalogCategory;
  this.author = author;
  this.des = des;
  this.rating = rating;
  this.imageUrl = imageUrl;

}


var AbstractAlgebra = new Book("M1", "ABSTRACT ALGEBRA: AN INTRODUCTION",
"Math", "Thomas W. Hungerford","Is intended for a first undergraduate course in modern abstract algebra. Its flexible design makes it suitable for courses of various lengths and different levels of mathematical sophistication, ranging from a traditional abstract algebra course to one with a more applied flavor.  The book is organized around two themes: arithmetic and congruence. Each theme is developed first for the integers, then for polynomials, and finally for rings and groups, so students can see where many abstract concepts come from, why they are important, and how they relate to one another.",
"* * *" , "/resource/abstract_algebra1.jpg");

var JavaServlets = new Book( "CS1","Murach's Java Servlets and JSP, 3rd Edition","Computer Science", "Andrea Steelman", "This new edition of Murach's Java Servlets and JSP makes it easier than ever for Java developers to master web programming. It shows how to install and use the Tomcat server and the NetBeans IDE. It shows how to use JSPs and servlets to build secure and well-structured web applications that implement the MVC pattern. It shows how to use sessions, cookies, JavaBeans, EL, JSTL, and custom tags. It shows how to use JDBC or JPA to work with a MySQL database.", "* * *","/resource/MurachsJava.jpg");

var ThinkJava = new Book("CS2", "Think Java", "Computer Science", "Allen B. Downey","Currently used at many colleges, universities, and high schools, this hands-on introduction to computer science is ideal for people with little or no programming experience. The goal of this concise book is not just to teach you Java, but to help you think like a computer scientist. You’ll learn how to program—a useful skill by itself—but you’ll also discover how to use programming as a means to an end.",
"* * * *","/resource/ThinkJava.jpg")

var ThinkData = new Book("CS3", "Think Data Structures", "Computer Science", "Allen B. Downey","If you’re a student studying computer science or a software developer preparing for technical interviews, this practical book will help you learn and review some of the most important ideas in software engineering—data structures and algorithms—in a way that’s clearer, more concise, and more engaging than other materials.",
"* * * *","/resource/ThinkData.jpg");

var Calculus4 = new Book("M2", "Calculus, 4th edition", "Math", "Michael Spivak" ,"Calculus combines leisurely explanations, a profusion of examples, a wide range of exercises and plenty of illustrations in an easy-going approach that enlightens difficult concepts and rewards effort. Ideal for honours students and mathematics majors seeking an alternative to doorstop textbooks and more formidable introductions to real analysis.   ",
"*" , "/resource/Calculus4.jpg");

var GlencoeGeometry = new Book("M3", "Glencoe Geometry", "Math", "S&P Global", "Personalized study resources include LearnSmart®, which uses adaptive review technology-enhanced questions to measure student accuracy, number of attempts, time spent, requests for help, and confidence level to predict what course topics a student is most likely to forget. LearnSmart revisits those topics using engaging resources to build retention for the End-of-Course Test.",
"* *","/resource/GlencoeGeometry.jpg");

var bookList = [AbstractAlgebra, Calculus4, JavaServlets, ThinkJava, ThinkData, GlencoeGeometry];

function getItems(){
  return bookList;
}

function getItem(itemID){
  for (var x in bookList) {
    if(bookList[x].itemCode == itemID){
      return bookList[x];
    }
  }
  return 0;
}



//UserItem


//UserProfile




module.exports.bookList = bookList;
exports.getItems = getItems;
exports.getItem = getItem;
