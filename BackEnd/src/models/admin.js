const mongoose = require ('mongoose');
const validator = require ('validator');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const employee = require ('./employee');

const adminSchema = new mongoose.Schema ({
    role: {
        type: String,
        enum: ['hc', 'cs'],
        required: true,
        default: 'hc',
    },
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email must be valid')
            }
        }
    },
    phone: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 11) {
                throw new Error('Phone must be valid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
    
},{timestamps: true});

adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObject = admin.toObject()
    delete adminObject.password
    delete adminObject.tokens
    // delete adminObject.avatar

    return adminObject
}

adminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = jwt.sign({ _id: admin.id.toString() }, process.env.SECRET,
        { expiresIn: '1h' })

    admin.tokens = admin.tokens.concat({ token })
    await admin.save()

    return token

}

//find admin by credentials using adminname or email
adminSchema.statics.findByCredentials = async (name, password) => {
    const admin = await Admin.findOne({ $or: [{ phone: name }, { email: name }] })


    if (!admin) {
        throw new Error('Invalid Credentials')
    }
    // const isMatch = await bcrypt.compare(password, admin.password)
    // if (!isMatch) {
    //     throw new Error('Invalid Credentials')
    // }
    return admin
}


// adminSchema.statics.findByCredentials = async (email, password) => {
//     const admin = await admin.findOne({ email } || { adminname: email })
//     if (!admin) {
//         throw new Error('Unable to login')
//     }

//     const isMatch = await bcrypt.compare(password, admin.password)
//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }
//     return admin
// }

//  hash password before saving
adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})
//delete merchant item when admin
adminSchema.pre('deleteone', { document: true }, async function (next) {
    const admin = this
    if (admin.role === 'hc') {
        await Item.deleteMany({ hc: admin._id })
    }
})


const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;