const jwt = require('jsonwebtoken')
const Employee = require('../models/employee')

const auth = async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.SECRET)

        const employee = await Employee.findOne({_id:decoded._id, 'tokens.token':token})

        if(!employee){
            throw new Error()
        }
        req.token = token
        req.employee = employee
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth;