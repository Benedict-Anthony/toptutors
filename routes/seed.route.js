
const express = require('express')
const userAuth = require('../middleware/userauth')
const SeedController = require('../controllers/seedController')
const router = express.Router()

router.post('/parents', async(req, res)=>{
    const seedController = new SeedController()
    return await seedController.seedParent(req, res)
})

router.post('/tutors', async(req, res)=>{
    const seedController = new SeedController()
    return await seedController.seedTutor(req, res)
})

module.exports = router