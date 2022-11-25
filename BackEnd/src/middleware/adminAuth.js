const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

//auth user and merchant

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET);
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token });
        if (admin.role === 'hc') {
            req.merchant = admin;
            next();
        }
        if (admin.role === 'cs') {
            req.admin = admin;
            next();
        }
        if (!admin) {
            throw new Error('Not authenticated');
        }

    } catch (error) {
        res.status(401).send({ error: 'Invalid Token' });
    }
}
module.exports = adminAuth;