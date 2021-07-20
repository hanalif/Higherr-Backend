const gigService = require('./gig.service')
const socketService = require('../../services/socket.service')
const utilService = require('../../services/util.service')
const logger = require('../../services/logger.service')

async function getGig(req, res) {
    try {
        const { gigId } = req.params
        const gig = await gigService.getById(gigId)
        res.send(gig)
    } catch (err) {
        logger.error('Failed to get gig', err)
        res.status(500).send({ err: 'Failed to get gig' })
    }
}

async function getGigs(req, res) {
    try {
        // const filterBy = {
        // }
        const gigs = await gigService.query()
        res.send(gigs)
    } catch (err) {
        logger.error('Failed to get gigs', err)
        res.status(500).send({ err: 'Failed to get gigs' })
    }
}

async function deleteGig(req, res) {
    try {
        const { gigId } = req.params
        await gigService.remove(gigId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete gig', err)
        res.status(500).send({ err: 'Failed to delete gig' })
    }
}

async function createGig(req, res){
    try {
        const {title, jobDescription, price, tags, delivery, imgUrls, seller} = req.body
        const gig = {
            title,
            jobDescription,
            price,
            tags,
            delivery,
            imgUrls,
            seller
        }
        const newGig = await gigService.add(gig)
        res.send(newGig)
    } catch (err) {
        logger.error('Failed to create gig', err)
        res.status(500).send({ err: 'Failed to create gig' })
    }
}


async function updateGig(req, res) {
    try {
        const {_id, title, jobDescription, price, tags, imgUrls, delivery,seller} = req.body
        const gig = {
            _id,
            title,
            jobDescription,
            price,
            tags,
            imgUrls,
            delivery,
            seller
        }
        console.log(gig)
        const savedGig = await gigService.update(gig)
        res.send(savedGig)
    } catch (err) {
        logger.error('Failed to update gig', err)
        res.status(500).send({ err: 'Failed to update gig' })
    }
}

module.exports = {
    getGig,
    getGigs,
    deleteGig,
    updateGig,
    createGig,
}