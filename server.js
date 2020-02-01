const express = require('express')
const pg = require('pg')
const ejs = require('ejs')
const path = require('path');
const { Pool, Client } = require('pg')
const database = require('./config/databaseConfig')
const db = new Pool();
const cookieParser = require('cookie-parser'); // in order to read cookie sent from client
const uuid = require('uuidv4').default;
var redis = require('redis');
var redisClient = redis.createClient(6379, '127.0.0.1',{no_ready_check: true});
const loginroutes = require('./routes/loginroutes')
const dashboardroutes = require('./routes/dashboard')
const pplTitleRoutes = require('./routes/ppltitleroutes')
const branchRoutes = require('./routes/branchroutes')
const companyRoutes = require('./routes/companyroutes')
const designationRoutes = require('./routes/designation')
const employeeRoutes = require('./routes/employeeroutes')

redisClient.auth('kVG/mXAuJVSgvkFbwGEQgOfWmKZy28o5KXsLWTxR2hb4Dj7FDtJeyYsEQGkb0NZ7T0XD3vIHVZi4Bd1K', function(err, reply){
  if(err){
    console.log(err);
    
  } else {
    console.log(reply);
    
  }
})



redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

const app = express()
app.use(cookieParser());

//set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.token;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber = uuid()
    
    res.cookie('token',randomNumber, { maxAge: 31556952000, httpOnly: true });
    console.log('cookie created successfully', randomNumber);
  } 
  else
  {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // <-- important!
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')
app.use(logErrors);
app.use(clientErrorHandler)
app.use(errorHandler)



//console.log(database);

;(async function () {
    const client = await database.connect()
    //await client.query('SELECT NOW()')
    //client.release()
    app.locals.clients =  client;
    const rclient = await redisClient.on('connect', function() {
        console.log('Redis client connected');
    });
    app.locals.rclients = rclient
  //  console.log(client);

    app.listen(3000)

    // database.connect((err, client, done) => {
    //     if (err) throw err;
    //     app.locals.pool =  client;
    //     console.log(client);

    //     app.listen(3000)
    // })
})();

app.use('/login', loginroutes)
app.use('/dashboard', dashboardroutes)
app.use('/ppltitles', pplTitleRoutes)
app.use('/branch', branchRoutes)
app.use('/company', companyRoutes)
app.use('/designation', designationRoutes)
app.use('/employee', employeeRoutes)

app.use('/', function(req, res){
    console.log('Cookies: ', req.cookies)
    var domain = req.headers.host,
    subDomain = domain.split('.');
    console.log(req.headers.host)

    res.json({status: "OK", message:"Server Started", data:subDomain[0]})
})



//express error handling
app.use(function(req, res, next){
    let err = new Error('Not Found');
    console.log(err);
    console.error(err.stack)
  
    err.status = 404;
    next(err);
})
  

app.use(function(err, req, res, next){
    console.log(err);
      console.error(err.stack)
    if(err.status === 404){
      res.status(404).json({message:"Not Found"});
    } else {
      res.status(500).json({message:"Something went wrong"});
      }
})
  
function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}
  
function clientErrorHandler (err, req, res, next) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
}
  
function errorHandler (err, req, res, next) {
    res.status(500)
    res.render('error', { error: err })
}