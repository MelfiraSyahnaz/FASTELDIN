const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    witel: {
        type: String,
        required: true,
    },
    internet_number: {
        type: Number,
        required: true,
    },
    
    

},
    {timestamps: true}
);

module.exports =
mongoose.models.proposal || mongoose.model("proposal", proposalSchema);
