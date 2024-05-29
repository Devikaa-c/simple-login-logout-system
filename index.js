const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const flash = require('express-flash');

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); 

app.use(flash());

app.use(
    session({
        secret: "devika",
        resave: false,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
  res.set({"Cache-control":"no-store, must-revalidate, no-store"});
  next();
});
 
const isAuthenticated = (req, res, next) => {
    try {
        if (req.session.login) {
            next();
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        res.send("server error");
    }
};

const isNotAuthenticated = (req, res, next) => {
    try {
      console.log(req.session.login)
        if (!req.session.login) {
            next();
        } else {
            res.redirect("/");
        }
    } catch (error) {
        res.send("server error");
    }
};

app.get("/", isAuthenticated, (req, res) => {
    try {
      console.log(req.session.login)
        res.render("home");
    } catch (error) {
        res.send("server error");
    }
});

app.get("/login", isNotAuthenticated, (req, res) => {
    try {
        res.render("login" ,{ messages: req.flash('error') });
    } catch (error) {
        res.send("server error");
    }
});

app.get("/logout", isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
}); 

const emaill = "devika@gmail.com" ;
const passwordd = "admin123" ;

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === emaill && password === passwordd) {
      req.session.login = { email, password };
      req.session.login = true;
      console.log(req.body.email)
      res.redirect('/');
  } else {
    req.flash('error', 'Login failed. Please check your credentials.');
    res.redirect('/login');
  }
});



app.listen(4000, () => console.log("server is running at http://localhost:4000"));
