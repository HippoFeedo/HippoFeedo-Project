/**
 * Created by abhinav on 3/12/15.
 */
var express = require("express");
var app = express();
var http = require('http');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser());
app.use(express.static(__dirname + "/public", {maxAge: 3456700000}));
var connection = require("../connection");
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(session({secret: '1234567890QWERTY'}));

var router = express.Router();


module.exports = function(app){
    app.get('/', function(req, res){
        res.render("login.html");
    });

    app.post('/adduser', function(req, res){

        var name = req.body.name;
        var email = req.body.email;
        var employeeid = req.body.employeeid;
        var password = req.body.password;
        var position='';
        var joining_date= '';
        var active= 'Y';

        console.log("Name: " + name + " Email: " + email + "Employee id: " +employeeid);

        connection.checkDuplicate(email, employeeid, function(val){

            if(val==1){

               res.redirect('/registeropen?error');
            }
            else {
                connection.add(name,email,employeeid,password,position,joining_date,active);
                res.redirect("/loginopen?success");
            }

        });
    });

    app.get('/loginopen', function(req, res){
        res.render("login.html");

    });

    app.get('/registeropen', function(req, res){
        res.render("register.html");


    });

    app.get('/index.html', function(req, res){

            if (req.session.email!=null) {

                res.render("index.html");
            }
        else
            {
                res.end('<div><h1>You are not authorized to view this page!</h1></div></br><a href="/loginopen">Click here to login</a>');
            }



    });

    /*app.get('/checkuser', function(req, res){    //just in case :P

        req.session.email=req.param('email');

        var email = req.param('email');
        var password = req.param('password');


        console.log(" Email: " + email);
        var cred = {
            email : email,
            password : password
                    }
       connection.check(cred,function(o)
           {
               if (req.session.email&&o==1) {

                       res.redirect("index.html");
                   }

               else
               {
                   req.session.email=null;
                   res.end('<div><h1>Username and password is invalid!</h1></div></br><a href="/loginopen">Click here to login again</a>');
               }

           }
       );
    });*/

    app.post('/checkuser', function(req, res) {

            req.session.email = req.body.email;

            var email = req.body.email;
            var password = req.body.password;


            console.log(" Email: " + email + " Pass: " + password);

            //console.log(" Email: " + email);
            var cred = {
                email : email,
                password : password
            }
            connection.check(cred,function(o)
                {
                    if (req.session.email && o==1) {

                        res.render("index.html");
                    }

                    else
                    {
                        req.session.email=null;
                        //res.end('<div><h1>Username and password is invalid!</h1></div></br><a href="/loginopen">Click here to login again</a>');
                        res.redirect("/loginopen?error");
                    }

                }
            );



    });

    app.get('/logout', function(req, res){
        console.log("Logged out from "+req.session.email);
        req.session.email=null;
        res.redirect("/?loggedout");

    });

    app.get('/complaints', function(req, res){

        if(req.session.email!=null)
            res.render("complaints.html");
        else
            res.end('<div><h1>You are not authorized to view this page!</h1></div></br><a href="/loginopen">Click here to login</a>');
    });

    app.get('/addcomplaint', function(req, res){
        res.redirect("index.html");
        var email = req.session.email;
        var title = req.param('title');
        var description = req.param('description');
        var priority=req.param('priority');
        var d = new Date();
        var now = d.toLocaleString();

        console.log("Title: " + title + "Description: " +description);

        connection.addcomplaint(email,title,description,priority,now);
    });

}