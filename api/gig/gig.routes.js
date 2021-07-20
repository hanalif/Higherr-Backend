const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {createGig,getGig, getGigs, deleteGig, updateGig} = require('./gig.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
// router.use(requireAdmin)


router.get('/', getGigs) //Gig List
router.post('/', createGig)// Gig Create
router.put('/', updateGig) //Gig Update
router.get('/:gigId', getGig) //Toy read single
router.delete('/:gigId', deleteGig)//Gig delete

// requireAuth, requireAdmin,


module.exports = router