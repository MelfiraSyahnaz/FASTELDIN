const express = require('express');
const Admin = require('../models/admin');
const router = new express.Router();


//fetch all admins
router.get('/admin/getAll', async (req, res) => {
    try {
        const admin = await Admin.find({});
        res.send(admin);
    } catch (e) {
        res.status(500).  send(e);
    }
})


// Create a new admin
router.post('/admin/reg', async (req, res) => {
    const admin = new Admin(req.body);
    console.log (admin);
    try {
        await admin.save();
        const token = await admin.generateAuthToken();
        res.status(201).send({ admin, token });
    } catch (e) {
        res.status(400).send(e);
        console.log (e);
    }
});

// Login an admin
router.post('/admin/login',  async (req, res) => {
    const field = Object.keys(req.body);
    const allowedFields = ['email','phone', 'password'];
    const isValidOperation = field.every((field) => allowedFields.includes(field));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid login' });
    }
    try {
        const admin = await Admin.findByCredentials(
        req.body.phone || bodyreq.body.email,
        req.body.password
        
        );
        const token = await admin.generateAuthToken();
        res.send({ admin, token });
    } catch (e) {
        res.status(400).send(e) ;
        console.log (e);
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

router.patch('/admin/update/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'phone', 'password'];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const admin = await Admin.findById(req.params.id);
        updates.forEach((update) => (admin[update] = req.body[update]));
        await admin.save();
        if (!admin) {
            return res.status(404).send();
        }
        res.send(admin);
    } catch (e) {
        res.status(400).send(e);
    }
});

//delete admin
router.delete('/admin/delete/:id', async (req, res) => {
    try {
        const admin = await req.Admin.deleteOne({ _id: req.params.id });
        if (!admin) {
            res.status(404).send();
        }
        res.send(admin);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router ;