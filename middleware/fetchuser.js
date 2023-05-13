const jwt = require('jsonwebtoken');
const jwtsecreat='akshat09'
const fetchuser=(req,res,next)=>{
    const token=req.header('authtoken');
    if(!token){
        res.status(401).send({error:'plz authenticate using valid token'})
    }
  try {
    const data=jwt.verify(token,jwtsecreat);
    req.user=data
    next()
    
  } catch (error) {
       res.status(401).json(error)
  }
}

module.exports=fetchuser