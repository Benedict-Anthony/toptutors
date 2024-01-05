var express = require('express');
var router = express.Router()
var dbAdmin = require('../model/admin.model');
var paginatedModel = require('../middleware/pagination_middleware');
var Reffered = require('../model/admin_reffered');

const Admin = [
    { name:'Admin 1', id:1 },
    { name:'Admin 2', id:2 },
    { name:'Admin 3', id:3 },
    { name:'Admin 4', id:4 },
    { name:'Admin 5', id:5 },
    { name:'Admin 6', id:6 },
    { name:'Admin 7', id:7 },
    { name:'Admin 8', id:8 },
    { name:'Admin 9', id:9 },
    { name:'Admin 10', id:10 }
]

router.get('/',paginatedModel(Admin),(req,res)=>{
    res.json(res.paginatedModel)
})

// router.post('/reffered/:id',(req,res)=>{
//     const refferedId = req.params.id
//     dbAdmin.findById({_id:refferedId})
//     .populate('refferal').exec(function (err, result) {
//         if (err) return handleError(err);
//         console.log('The author is %s',result );
//         // prints "The author is Ian Fleming"
//       });
//   })

router.post('/admin',(req,res)=>{
    const newadmin = new dbAdmin({
        name:req.body.name,
        role:req.body.role
    })
    newadmin.save()
    .then(record=>{
        res.send(record)
    })
    .catch(err=>{
        console.log(err)
        res.json(err)
    })
})

router.post('/reffered/:id',(req,res)=>{
    const id = req.params.id;
    const newlyRefferedAgent = new Reffered({
        name:req.body.name,
        phone:req.body.phone,
        referredBy:id,
        address:req.body.address
    })
    newlyRefferedAgent.save()
    .then(doc=>{
        res.json({
            message:"referal successfull",
            status:201,
            doc
        })
    })
    .catch(error=>{
        res.json({
            message:"referal failed",
            status:400,
            reason:error
        })
    })
})

// get all referedby admin
router.get('/admin/reffered',(req,res)=>{
    Reffered.find().populate('referredBy').exec()
    .then(response=>{
        res.json(response)
    })
    .catch(err=>{
        console.log(err)
        res.json(err)
    })
})

//get all users
router.get('/admin',(req,res)=>{
    dbAdmin.find().populate('refferedBy').exec()
    .then(response=>{
        res.json(response)
    })
    .catch(err=>{
        console.log(err)
        res.json(err)
    })
})


module.exports = router