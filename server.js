//import
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var formidable = require("formidable");
var fs = require("fs");
var session = require("express-session");
var nodemailer = require("nodemailer");
app.use(session({
    key: "admin",
    secret: "lol"
}));

app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


//connect to mongodb
var MongoClient = require("mongodb").MongoClient;
const { response } = require("express");
const { ObjectId } = require("mongodb");
const { EDESTADDRREQ } = require("constants");
var http = require("http").createServer(app);
var io = require("socket.io")(http);
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true },
    function (error, client) {
        var blog = client.db("blog");
        console.log("DB conencted");

        //load main page
        app.get('/', (req, res) => {
            //find from collection called settings to access the limit of post 
            blog.collection("settings").findOne({}, function (error, settings) {
                //limit the number of post per page
                var postLimit = parseInt(settings.post_limit);
                //sort with id 1 means sort from oldest to latest with limit and convert to array so that we can loop the post in ejs
                blog.collection("posts").find().sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    //render ejs file called home and pass posts and postlimit params
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        });

        //send email to receive feedback from user
        app.post("/send-email", function (req, res) {  
            //create services          
            var transporter = nodemailer.createTransport({
                "service": "gmail",
                "auth": {
                    "user": "limzhengqian12@gmail.com",
                    "pass": "abcde123"
                }
            });
            //detail of email sent
            var mailOption = {
                "from": req.body.email,
                "to": "limzhengqian12@gmail.com",
                "subject": "Feedback from user: " + req.body.fname + " " + req.body.lname,
                "text": req.body.comment
            };
            //send email
            transporter.sendMail(mailOption, function (error, info) {
                //redirect back to home page
                res.redirect("/");
            });
        });

        //get next/previous page
        app.get("/get-posts/:start/:limit", function (req, res) {
            //find collection named posts and skip the amount of post displayed already and limit it based on settings
            blog.collection("posts").find().sort({
                "_id": 1
            }).skip(parseInt(req.params.start)).limit(parseInt(req.params.limit)).toArray(function (error, posts) {
                res.send(posts);
            });
        });

        //render contact.ejs 
        app.get("/admin/contacts", function (req, res) {
            res.render("admin/contact");
        });

        //go to settings page
        app.get("/admin/settings", function (req, res) {
            //if login person is an admin,
            if (req.session.admin) {
                //render settings.ejs and pass login account details
                res.render("admin/settings", { user: req.session.admin.email });
            }
            else {
                //else back to login page
                res.redirect("/admin");
            }
        });

        //when live tag is chosen
        app.get("/live", function (req, res) {
            //get post limit
            blog.collection("settings").findOne({}, function (error, settings) {
                //convert to integer
                var postLimit = parseInt(settings.post_limit);
                //find collection named posts and document with tag called LIVE and pass to home.ejs to display all document with tag called LIVE
                blog.collection("posts").find({ "tag": "LIVE" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        //same with live tag chosen but is place tag
        app.get("/place", function (req, res) {
            blog.collection("settings").findOne({}, function (error, settings) {
                var postLimit = parseInt(settings.post_limit);
                blog.collection("posts").find({ "tag": "PLACE" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        app.get("/admin/chglog",function(req,res){
            if(req.session.admin){
                blog.collection("history").find().sort({"_id" : -1}).toArray(function(error,log){
                    res.render("admin/chglog",{log : log , user : req.session.admin.email});
                });
            }
            else{
                res.redirect("/admin");
            }
        });
        //same with live tag chosen but is game tag
        app.get("/game", function (req, res) {
            blog.collection("settings").findOne({}, function (error, settings) {
                var postLimit = parseInt(settings.post_limit);
                blog.collection("posts").find({ "tag": "GAME" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        //same with live tag chosen but is sports tag
        app.get("/sports", function (req, res) {
            blog.collection("settings").findOne({}, function (error, settings) {
                var postLimit = parseInt(settings.post_limit);
                blog.collection("posts").find({ "tag": "SPORTS" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        //same with live tag chosen but is food tag
        app.get("/food", function (req, res) {
            blog.collection("settings").findOne({}, function (error, settings) {
                var postLimit = parseInt(settings.post_limit);
                blog.collection("posts").find({ "tag": "FOOD" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        //same with live tag chosen but is people tag
        app.get("/people", function (req, res) {
            blog.collection("settings").findOne({}, function (error, settings) {
                var postLimit = parseInt(settings.post_limit);
                blog.collection("posts").find({ "tag": "PEOPLE" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        //same with live tag chosen but is animal tag
        app.get("/animal", function (req, res) {
            blog.collection("settings").findOne({}, function (error, settings) {
                var postLimit = parseInt(settings.post_limit);
                blog.collection("posts").find({ "tag": "ANIMAL" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        //same with live tag chosen but is plant tag
        app.get("/plant", function (req, res) {
            blog.collection("settings").findOne({}, function (error, settings) {
                var postLimit = parseInt(settings.post_limit);
                blog.collection("posts").find({ "tag": "PLANT" }).sort({ "_id": 1 }).limit(postLimit).toArray(function (error, posts) {
                    res.render('user/home', { posts: posts, postLimit: postLimit });
                });
            });
        })

        //when submit the settings option
        app.post("/admin/save_settings", function (req, res) {
            blog.collection("history").insertOne({"change" : "Post Limit iss updated", "date" : new Date()});
            //update document in collection called stting            
            blog.collection("settings").update({}, {
                //set post limit to the new ,imit setted
                $set: { "post_limit": req.body.post_limit }
                //upsert true will make sure no new document created
            }, { upsert: true }, function (error, document) {
                //back to settings page
                res.redirect("/admin/settings");
            });
        });

        //when admin dashboard is chosen
        app.get("/admin/dashboard", (req, res) => {
            //if you are the admin
            if (req.session.admin) {
                //find collection called posts and convert all the posts into array
                blog.collection("posts").find().toArray(function (error, posts) {
                    //render dashboard.ejs and pass admin account detail and postz
                    res.render("admin/dashboard", { user: req.session.admin.email, posts: posts });
                });
            }
            //if not admin back to sign in page
            else { res.redirect("/admin"); }
        });

        //if choose to posts stuff
        app.get("/admin/posts", (req, res) => {
            //if you are admin
            if (req.session.admin) {
                //not nessesary to pass post unless you want to display them, in my blog i didnt use it but i still pass anyway
                blog.collection("posts").find().toArray(function (error, posts) {
                    res.render("admin/posts", { user: req.session.admin.email, posts: posts });
                });

            }
            //back to sign in page
            else {
                res.redirect("/admin");
            }
        });

        //if edit post is chosen
        app.get("/posts/edit/:id", function (req, res) {
            //if you are an admin
            if (req.session.admin) {
                //find collection called posts
                blog.collection("posts").findOne({
                    //find the object you want to edit with its unique id
                    "_id": ObjectId(req.params.id)
                }, function (error, post) {
                    //once found pass the post details and admin email
                    res.render("admin/edit_post", { post: post, user: req.session.admin.email });
                });
            }
            //if not admin back to sign in page
            else {
                res.redirect("/admin");
            }
        });

        //edit post
        app.post("/do-edit-post", function (req, res) {
            //in colelction called posts, find specific doucument with unique id
            blog.collection("posts").updateOne({
                "_id": ObjectId(req.body._id)
            }, {
                //once found, change detail
                $set: {
                    "title": req.body.title,
                    "content": req.body.content,
                    "date": req.body.date,
                    "image": req.body.image
                }                
            }, function (error, post) {
                blog.collection("history").insertOne({"change" : req.body.title + " is editted", "date" : new Date()});
                res.send("updated");
            });
        });

        //login
        app.post("/do-admin-login", function (req, res) {
            
            //find whether the email and password entered is in collection called admin
            blog.collection("admin").findOne({ "email": req.body.email, "password": req.body.password }, function (error, admin) {
                //if correct, login
                if (admin != "") {
                    req.session.admin = admin;
                    blog.collection("history").insertOne({"change" : req.body.email + " logged in", "date" : new Date()});
                }                
                res.send(admin);
                
            });
        });

        //if user want to enter admin page
        app.get("/admin", function (req, res) {
            //need to login first
            res.render("admin/login");
        })

        //if user want to read more
        app.get("/posts/:id", function (req, res) {
            //find the post in collection called posts with id
            blog.collection("posts").findOne({ "_id": ObjectId(req.params.id) }, function (error, post) {
                //display the post on post.ejs
                res.render("user/post", { post: post })
            });
        });

        //reply to comment
        app.post("/do-reply", function (req, res) {
            //create an id
            var reply_id = ObjectId();
            //find the comment to be replied by id and update
            blog.collection("posts").updateOne({
                "_id": ObjectId(req.body.post_id),
                "comments._id": ObjectId(req.body.comment_id)
            }, {
                //push the reply info into an array called reply of the comment
                $push: {
                    "comments.$.reply": {
                        "_id": reply_id,
                        name: req.body.name,
                        reply: req.body.reply,
                        date: req.body.date
                    }
                }

            }, function (error, document) {
                res.send({
                    text: "Replied",
                    _id: reply_id
                });
            });
        });

        //if comment
        app.post("/do-comment", (req, res) => {            
            //create and id for the comment
            var comment_id = ObjectId();
            //find the post in colection called posts using id
            blog.collection("posts").update({ "_id": ObjectId(req.body.post_id) }, {
                //push the comment made into an array called comments for the post
                $push: {
                    "comments": {
                        _id: comment_id,
                        username: req.body.username,
                        comment: req.body.comment,
                        email: req.body.email,
                        date: req.body.date
                    }
                }
            }, function (error, post) {
                res.send("comment ssuccess");
            });
        });

        //when post
        app.post("/do-post", (req, res) => {
            blog.collection("history").insertOne({"change" : req.body.title + " is posted", "date" : new Date()});
            //in the collection called posts, insert a new document with the detail passed from form
            blog.collection("posts").insertOne(req.body, function (error, document) {
                res.send({
                    text: "Posted success",
                    _id: document.insertedId
                });
            });
        });

        //when upload image
        app.post("/do-upload-image", function (req, res) {
            var formData = new formidable.IncomingForm();
            formData.parse(req, function (error, fields, files) {
                //old path of the image
                var oldPath = files.file.path;
                //create a new path for the images to be stored
                var newPath = "static/images/" + files.file.name;
                //rename the file from old path name to new path name
                fs.rename(oldPath, newPath, function (err) {
                    res.send("/" + newPath);
                });
            });
        });

        //delete post
        app.post("/do-delete", function (req, res) {
            blog.collection("history").insertOne({"change" : req.body.title + " is deleted", "date" : new Date()});
            //if you log im as admin
            if (req.session.admin) {
                //remove the document .replace is to delete the image store inside your file
                fs.unlink(req.body.image.replace("/", ""), function (error) {
                    //find the document based on the id and remove it
                    blog.collection("posts").remove({
                        "_id": ObjectId(req.body._id)
                    }, function (error, document) {
                        res.send("Deleted");
                    });
                });
            }
            else {
                res.redirect("/admin");
            }
        });

        //update image when edit post
        app.post("/do-update-image", function (req, res) {
            //ssame with uplaod image but need to remove the old image first            
            var formData = new formidable.IncomingForm();
            formData.parse(req, function (error, fields, files) {
                fs.unlink(fields.image.replace("/", ""), function (error) {
                    var oldPath = files.file.path;
                    var newPath = "static/images/" + files.file.name;

                    fs.rename(oldPath, newPath, function (err) {
                        res.send("/" + newPath);
                    });
                });

            });
        });

        //log out
        app.get("/do-logout", function (req, res) {
            //destroy the session
            req.session.destroy();
            //back to sign in page
            res.redirect("admin");
        });
        io.on("connection", function (socket) {
            console.log("User connected");
            socket.on("new_post", function (formData) {
                console.log(formData);
                socket.broadcast.emit("new_post", formData);
            });
        });
        //connect to port 3000
        http.listen(3000, function () {
            console.log("connected");
        });
    });


