var express = require('express');
var app = express();
var userRoutes = require('./Route/users.route')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var adminRoutes = require('./Route/admin.route');
var companyRoutes = require('./Route/company.route');
var parentRoute = require('./Route/parents.route');

//app middleware sec
app.use(bodyParser.json());
app.use('/users',userRoutes);
app.use('/admins',adminRoutes);
app.use('/company',companyRoutes);
app.use('/parent',parentRoute);


//connect to mongodb
mongoose.Promise = global.Promise
try {
const uri = "mongodb+srv://Honorableisrael:01uNyPvNjb0nSoWO@clusterhilary-vscri.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex: true,
})
mongoose.set('useFindAndModify', false);
let db = mongoose.connection;
db.once('open',()=>console.log('db is initailized'))
db.on('err',()=>console.log(err))
}
catch(error){
    console.log(error)
}


const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log('server is running on port' + port)
})