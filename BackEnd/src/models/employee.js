const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Task = require('./proposal')


const employeeSchema = new mongoose.Schema({
    NIK: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: { 
        type: String, 
        required: true
    },
    position: {
        type: String, 
        required: true 
    },
    band_position: {
        type: String,
        required: true,
        Enum: ['1', '2', '3', '4', '5', '6']
    },
    phone: { 
        type: Number,
        unique: true,
        default: 0,
        validate(value) {
            if (value < 11) {
                throw new Error('Phone must be valid!')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain "password"')
            }
        }
    },
    status: {
        type: String,
        Enum: ['sent', 'ongoing', 'done'],
        default: 'sent',
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

},

{
    timestamps: true
})
employeeSchema.virtual('proposal', {
    ref: 'proposal',
    localField: '_id',
    foreignField: 'proposal'
})

employeeSchema.methods.toJSON = function () {
    const employee = this
    const employeeObject = employee.toObject()
    delete employeeObject.password
    delete employeeObject.tokens

    return employeeObject
}

employeeSchema.methods.generateAuthToken = async function () {
    const employee = this
    const token = jwt.sign({ _id: employee.id.toString() }, process.env.SECRET,
        { expiresIn: '1h' })

    employee.tokens = employee.tokens.concat({ token })
    await employee.save()

    return token

}

employeeSchema.statics.findByCredential = async (email, password) => {
    const employee = await employee.findOne({ email })
    if (!employee) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, employee.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return employee
}

//hash password before saving
employeeSchema.pre('save', async function (next) {
    const employee = this
    if (employee.isModified('password')) {
        employee.password = await bcrypt.hash(employee.password, 8)
    }

    next()
})
//delete employee when employee is removed
employeeSchema.pre('deleteOne', { document: true }, async function (next) {
    const employee = this
    await Task.deleteMany({ author: employee._id })
    next()
})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;