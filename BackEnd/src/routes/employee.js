const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const employAuth = require('../middleware/employAuth');
const Employee = require('../models/employee');
const { collection } = require('../models/proposal');
const router = new express.Router();


//fetch all employees
router.get('/employee/getAll', async (req, res) => {
    try {
        const employee = await Employee.find({});
        res.send(employee);
    } catch (e) {
        res.status(500).  send(e);
    }
});

// Create a new employee
router.post('/employee/reg', async (req, res) => {
    const employee = new Employee(req.body);
    console.log (employee);
    try {
        await employee.save();
        const token = await employee.generateAuthToken();
        res.status(201).send({ employee, token });
    } catch (e) {
        res.status(400).send(e);
        console.log (e);
    }
});

// Login an employee
router.post('/employee/login', async (req, res) => {
    const field = object.keys(req.body);
    const allowedFields = ['email', 'password'];
    const isValidOperation = field.every((field) => allowedFields.includes(field));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid login' });
    }
    try {
        const employee = await employee.findByCredentials(
        req.body.phone || bodyreq.body.email,
        req.body.password
        
        );
        const token = await employee.generateAuthToken();
        res.send({ employee, token });
    } catch (e) {
        res.status(400).send();

    }


});

// // Logout an employee
// router.post('/employee/logout', auth, async (req, res) => {
//     try {
//         req.employee.tokens = req.employee.tokens.filter((token) => {
//             return token.token !== req.token
//         })
//         await req.employee.save()
//         res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })

//update employee

router.patch('/employee/update/:id', employAuth,async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'phone', 'password'];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const employee = await Employee.findById(req.params.id);
        updates.forEach((update) => (employee[update] = req.body[update]));
        await employee.save();
        if (!employee) {
            return res.status(404).send();
        }
        res.send(employee);
    } catch (e) {
        res.status(400).send(e);
    }
});

//delete employee
router.delete('/employee/delete/:id', adminAuth, async (req, res) => {
    try {
        const employee = await Employee.deleteOne({ _id: req.params.id });
        res.send(employee);
    } catch (e) {
        res.status(500).send();
    }
});

//change status
router.patch('/employee/changeStatus/:id', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['status'];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send();
        }
        employee.status = req.body.status;
        await employee.save();
        res.send(employee);
    } catch (e) {
        res.status(400).send(e);
    }
});



module.exports = router ;