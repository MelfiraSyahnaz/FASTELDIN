const mongoose = require('mongoose')

// //db
// const db = module.exports = () =>{
//     const connectionParams={
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true

//     }
// }

try{
    mongoose.connect('mongodb://localhost:27017/fasteldin')
} catch (error) {
    console.log(error)
}