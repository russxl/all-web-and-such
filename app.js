//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/AirbnbDB", {useNewUrlParser: true,useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String,
  addy:String,
  reviews:[{
    user:String,
    rating:String,
    review:String
  }]
  
  
};

const signUpSchema = {
  userName:String,
  password:String,
  logged:Boolean
};

const Post = mongoose.model("Post", postSchema);
const Sign = mongoose.model("Sign", signUpSchema);
app.get("/home", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  Sign.find({logged:true},function(err,foundList){
    
    if(foundList.length===0){
      res.redirect("/sign-in");
    }else{
      res.render("compose");
    }
  });

  
});
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    addy:req.body.addy
  });


  post.save(function(err){
    if (!err){
        res.redirect("/home");
    }
  });
});

// app.get("/posts/:postId", function(req, res){

//   const requestedPostId = req.params.postId;
  
//     Post.findOne({_id: requestedPostId}, function(err, post){
  
//   if(!err){   
//      Sign.find({},function(err,foundList){
//     for(i of foundList){
//       console.log(i.logged);
//       if(i.logged === true){
//         Sign.findOne({logged:i.logged},function(err,foundList){
//           Sign.updateOne({logged:true},({$set:{_id2:requestedPostId}}))
//           res.render("post", {
//             _id:requestedPostId,
//             title: post.title,
//             content: post.content,
//             addy:post.addy,
            
//             foundList
//           });
//         })
//       }
//       else{
//         Sign.findOne({logged:i.logged},function(err,foundList){
//           res.render("post", {
//             title: post.title,
//             content: post.content,
//             addy:post.addy,
//             foundList
//           });
//         })
//       }
//     }
  
//   });}
//   else{}
  
//     })
  
//   })

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/sign-in",function(req,res){
  res.render("signin")
})

app.post("/sign-in",function(req,res){
  const post = new Sign({
    userName:req.body.Username,
    password:req.body.Password,
 

});

    Sign.find({},function(err,foundList){
    if(!err){

      for(i of foundList){

        if(i.userName===post.userName&&i.password===post.password){
          Sign.updateOne({userName:post.userName},{logged:true},function(err){
            console.log("success");
          })
          res.redirect('/dashboard');
        }
    else{
      console.log("wrong email or password");
      res.redirect("/sign-up")
    }
      }
  
    }
    else{
      console.log("wrong");
    }
  });
});



app.get('/sign-up',function(req,res){
  const sign = req.params.sign;
    res.render('landing',{title:sign});
  });



app.post("/sign",function(req,res){
  Sign.find({},function(err,foundList){
    if(foundList.length===0){
      const post = new Sign({
        userName:"admin",
        password:"123456",
        logged:false
    
    
    });
    post.save()
    res.redirect("/sign-in")
    }
   else{
    const post = new Sign({
      userName:req.body.Username,
      password:req.body.Password,
      logged:true
  
  
  });
  post.save(function(err){
    if (!err){
    res.redirect("/sign-in");
  }
  });
   }
  
  
  
  });
  })

app.get("/dashboard",function(req,res){
  Sign.find({logged:true},function(err,foundList){
    
    if(foundList.length===0){
      res.redirect("/sign-in");
    }else{
      Sign.findOne({logged:true},function(err,foundList){
        console.log(foundList);
        res.render('dashboard',{foundList});
      })
    }
  });
});
app.post("/logout",function(req, res){
  Sign.find({logged:true},function(err,foundList){
    console.log(foundList.length); 
  if(foundList.length===1){
  console.log(foundList); 
  Sign.findOne({logged:true},function(err,foundList){


  Sign.updateOne({password:""+foundList.password+""},{logged:false},function(err){
if(!err){
  console.log();
}
  })
  res.redirect('/home');
});
  
  }else{
    res.render("compose");
  }
});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
