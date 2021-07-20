
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add,
    getByUserId
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('order')
        var orders = await collection.find(criteria).toArray()
        orders = orders.map(order => {
            return order
        })
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getByUserId(loggedInUserId) {
    try {
        const collection = await dbService.getCollection('order')
        let userAsSellerOrders = await collection.find({ 'seller._id': loggedInUserId}).toArray()
        let userAsBuyerOrders = await collection.find({'buyer._id': loggedInUserId }).toArray()
        return {userAsSellerOrders, userAsBuyerOrders }

    } catch (err) {
        logger.error(`while finding orders of user ${userId}`, err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        let order = await collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}


async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function update(order) {
    try {
        // peek only updatable fields!
        const orderToSave = {
            _id: ObjectId(order._id),
            title: order.title,
            createdAt: order.createdAt ,
            price: order.price,
            buyer: order.buyer,
            seller: order.seller,
            status: order.status
        }

        const collection = await dbService.getCollection('order')
        await collection.updateOne({ '_id': orderToSave._id }, { $set: orderToSave })
        return orderToSave;
    } catch (err) {
        logger.error(`cannot update order ${order.title}`, err)
        throw err
    }
}

async function add(order) {
    try {
        // peek only updatable fields!
        const orderToAdd = {
            title: order.title,
            createdAt: new Date(),
            price: order.price,
            buyer: order.buyer,
            seller: order.seller,
            status: order.status
        }

        const collection = await dbService.getCollection('order')
        await collection.insertOne(orderToAdd)
        return orderToAdd
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.title) {
        const nameCriteria = { $regex: filterBy.title, $options: 'i' }
        criteria.$or = [
            {
                title: nameCriteria
            }
        ]
    }
    // if (filterBy.minBalance) {
    //     criteria.balance = { $gte: filterBy.minBalance }
    // }
    return criteria
}


