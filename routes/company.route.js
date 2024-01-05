const express = require('express');
const router = express.Router();
const Company = require('../model/company.model');


router.post('/new',(req,res)=>{
    const newCompany = new Company({...req.body});
    newCompany.save()
    .then(record=>{
        res.json({
            message:"successfully created company",
            data:record
        })
    })
    .catch(error=>{
        res.json({
            message:"failed to create company",
            error
        })
    })
})



router.get('/',(req,res)=>{
    Company.find()
    .then(record=>{
        res.json({
            message:"successfully operation",
            data:record
        })
    })
    .catch(error=>{
        res.json({
            message:"failed to fetch company list",
            error
        })
    })
})

module.exports = router;