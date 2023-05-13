const mongoose = require('mongoose');
var mongoDbUrl='mongodb://127.0.0.1:27017/inotebook'
var mongoDbAtlas='mongodb+srv://root:root@cluster0.w5itazv.mongodb.net/inotebook?retryWrites=true&w=majority'
function getconnection(){
    mongoose.connect(mongoDbAtlas).then(
        (data)=>{
            console.log("connected to mongo successfully")
        }
        ).catch((err)=>{
            console.log(err)
        })
}
module.exports=getconnection