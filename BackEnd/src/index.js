const express = require('express');
const app = express();
const cors = require('cors');
const employeeRouter = require('./routes/employee');
const adminRouter = require('./routes/admin');
const proposalRouter = require('./routes/proposal');
require("dotenv").config({ path : "./config/.env" });


//connect mongoose
require('./db/mongoose');

//middleware
app.use (express.json());
app.use(cors());
app.use(employeeRouter);
app.use(adminRouter);
app.use(proposalRouter);

//endpoints

app.get('/', (req, res) => {
    res.send('Welcome to fasteldin');
});

console.log(process.env.SECRET);

//set port
app.listen('3000', () => console.log("Server running at port 3000"));