const express = require('express');
const Proposal = require('../models/proposal');
const router = new express.Router();
const employAuth =  require('../middleware/employAuth');
const adminAuth =  require('../middleware/adminAuth');

//fetch all proposals
router.get('/proposal/getAll', async (req, res) => {
    try {
        //find All proposals
        const proposal = await Proposal.find({});
        res.send(proposal);
    } catch (e) {
        res.status(500).  send(e);
    }
});

// Create a new proposal
router.post('/proposal/create', employAuth, async (req, res) => {
    const proposal = new Proposal(req.body);
    console.log (proposal);
    try {
        await proposal.save();
        res.status(201).send({ proposal });
    } catch (e) {
        res.status(400).send(e);
        console.log (e);
    }
});

//get proposal by witel
    router.get('/proposal/getByWitel/:witel', adminAuth, async (req, res) => {
        try {
            const proposal = await Proposal.find({witel: req.params.witel});
            res.send(proposal);
        } catch (e) {
            res.status(500).send(e);
        }
    });

//delete proposal by id
router.delete('/proposal/delete/:id', adminAuth, async (req, res) => {
    if (req.admin === undefined) {
        return res.status(400).send({ error: "You are not a admin" });
      }
    try {
        const proposal = await Proposal.deleteOne({ _id: req.params.id });
        res.send(proposal);
    } catch (e) {
        res.status(500).send();
    }
});

    module.exports = router;
