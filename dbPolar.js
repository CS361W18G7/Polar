var express = require('express');
var mysql = require('./dbCon.js');

var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3001);


//Launches main landing page when no data submitted to root URL
app.get('/',function(req,res,next){
	var context = {};
	res.render('home',context);
});
//About page explaining purpose and design of site
app.get('/about',function(req,res,next){
	var context = {};
	res.render('about',context);
});

//Basic page (to mimic typical site)
app.get('/contact',function(req,res,next){
	var context = {};
	res.render('contact',context);
});

app.get('/register',function(req,res,next){
	
	var context = {};
	
	mysql.pool.query("SELECT `QuestID`,`QuestText` FROM Questions WHERE Type=? AND Status=?",[`Multi-Select`,`Active`],function(err, rows, fields){
			
			if(err){
				//next(err);
				console.log(err);
				return;
			}else if(rows.length > 0){
			
				context.QuesMult = rows
			
				var RanNum=Math.floor(Math.random()*3)+1;
			
				mysql.pool.query("SELECT `QuestID`,`QuestText` FROM Questions WHERE Type=? AND Status=? AND QuestID=?",[`Long Form`,`Active`,RanNum],function(err, rows, fields){
			
					if(err){
						//next(err);
						console.log(err);
						return;
					}else{
			
						context.QuesLong = rows
						console.log(context);
						res.render('register',context);
					}
				
				});
				
			}
			
	});
	
});

/*User login is handled by app.post('/')*/
app.post('/',function(req,res){
	
	var context = {};
	
	//console.log(req.body);
	
	if(req.body['myLogin']){
		
		mysql.pool.query("SELECT `Avatar`,`FirstName`,`UserID` FROM User WHERE UserName=? AND Password=?",[req.body.UserName,req.body.Password],function(err, rows, fields){
			
			if(err){
				//next(err);
				console.log(err);
				return;
			}else if(rows.length > 0){
			
				context.user = rows
			
				mysql.pool.query("SELECT `QuestText` FROM Questions as Q INNER JOIN UserProfile as UP ON UP.QuestID=Q.QuestID WHERE UP.UserID=(Select UserID From User Where UserName=? AND Password=?) AND UP.QuestAnswer IS NULL",[req.body.UserName,req.body.Password],function(err, rows, fields){

					if(err){
						//next(err);
						console.log(err);
						return;
					}
					
					context.MultSelect = rows;
					
					mysql.pool.query("SELECT `QuestText`, `QuestAnswer` FROM Questions as Q INNER JOIN UserProfile as UP ON UP.QuestID=Q.QuestID WHERE UP.UserID=(Select UserID From User Where UserName=? AND Password=?) AND UP.QuestAnswer IS NOT NULL",[req.body.UserName,req.body.Password],function(err, rows, fields){

						if(err){
							//next(err);
							console.log(err);
							return;
						}
					
							context.LongAnswer = rows;
							console.log(context);
							res.render('profile',context);
					
					});
					
				});
			
			}else{
				
				res.render('loginerror',context);
	
			}	
			
		});
		
	}
	
	
});

app.post('/register',function(req,res){
	
	var context = {};
	
	if(req.body['RegisterUser']){
		
		mysql.pool.query("INSERT INTO User (`FirstName`,`LastName`,`Avatar`,`Age`,`UserName`,`Password`,`Status`,`Gender`,`GeoArea`,`Email`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[req.body.sFirstName,req.body.sLastName,req.body.sIcon,req.body.sAge,req.body.sUserName,req.body.sPassword,`Current`,req.body.sGender,req.body.sZipCode,req.body.sEmail],function(err, result){
		
			if(err){
				//next(err);
				console.log(err);
				return;
			}
		
			mysql.pool.query("INSERT INTO UserProfile (`UserID`,`QuestID`) VALUES ((SELECT UserID FROM User WHERE FirstName = ? AND LastName = ?), ?)",[req.body.sFirstName, req.body.sLastName, req.body.MultiSelect1],function(err, result){
		
				if(err){
					//next(err);
					console.log(err);
					return;
				}
		
				mysql.pool.query("INSERT INTO UserProfile (`UserID`,`QuestID`) VALUES ((SELECT UserID FROM User WHERE FirstName = ? AND LastName = ?), ?)",[req.body.sFirstName, req.body.sLastName, req.body.MultiSelect2],function(err, result){
		
					if(err){
						//next(err);
						console.log(err);
						return;
					}
			
					mysql.pool.query("INSERT INTO UserProfile (`UserID`,`QuestID`,`QuestAnswer`) VALUES ((SELECT UserID FROM User WHERE FirstName = ? AND LastName = ?), ?, ?)",[req.body.sFirstName, req.body.sLastName, req.body.LongQues, req.body.LongAns],function(err, result){
		
						if(err){
							//next(err);
							console.log(err);
							return;
						}
			
						context.fName = req.body.sFirstName;
						console.log("Register Success");
						res.render('confirmation',context);
				
					});
				
				});
				
			});
		
		});
		
	}
	
});

//Page rendering for errors returned from the server.
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
