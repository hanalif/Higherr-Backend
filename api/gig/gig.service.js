
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')

const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query() {
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('gig')
        var gigs = await collection.find().toArray();
        gigs = gigs.map(gig => {
            return gig
        })
        return gigs
    } catch (err) {
        logger.error('cannot find gigs', err)
        throw err
    }
}

async function getById(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        let gig = await collection.findOne({ '_id': ObjectId(gigId) })
        return gig
    } catch (err) {
        logger.error(`while finding gig ${gigId}`, err)
        throw err
    }
}

async function remove(gigId) {
    try {
        const collection = await dbService.getCollection('gig')
        await collection.deleteOne({ '_id': ObjectId(gigId) })
    } catch (err) {
        logger.error(`cannot remove toy ${gigId}`, err)
        throw err
    }
}

async function update(gig) {
    try {
        // peek only updatable fields!
        const gigToSave = {
            _id: ObjectId(gig._id),
            title: gig.title,
            jobDescription: gig.jobDescription ,
            price: gig.price,
            delivery: gig.delivery,
            tags: gig.tags,
            imgUrls: gig.imgUrls || [],
            seller: gig.seller 
        }

        const collection = await dbService.getCollection('gig')
        await collection.updateOne({ '_id': gigToSave._id }, { $set: gigToSave })
        return gigToSave;
    } catch (err) {
        logger.error(`cannot update gig ${gig.title}`, err)
        throw err
    }
}

async function add(gig) {
    try {
        // peek only updatable fields!
        const gigToAdd = {
            title: gig.title,
            jobDescription: gig.jobDescription,
            price: gig.price,
            tags: gig.tags,
            imgUrls: gig.imgUrls,
            delivery: gig.delivery,
            seller: gig.seller
        }

        const collection = await dbService.getCollection('gig')
        await collection.insertOne(gigToAdd)
        return gigToAdd
    } catch (err) {
        logger.error('cannot insert gig', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        const nameCriteria = { $regex: filterBy.name, $options: 'i' }
        criteria.$or = [
            {
                name: nameCriteria
            }
        ]
    }
    // if (filterBy.minBalance) {
    //     criteria.balance = { $gte: filterBy.minBalance }
    // }
    return criteria
}


