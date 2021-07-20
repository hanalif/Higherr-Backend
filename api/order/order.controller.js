const orderService = require('./order.service')
const socketService = require('../../services/socket.service')
const utilService = require('../../services/util.service')
const logger = require('../../services/logger.service')

async function getOrder(req, res) {
    try {
        const { orderId } = req.params
        const order = await orderService.getById(orderId)
        res.send(order)
    } catch (err) {
        logger.error('Failed to get order', err)
        res.status(500).send({ err: 'Failed to get order' })
    }
}

async function getOrdersByloggedinUserId(req, res) {
    try {
        const { loggedInUserId } = req.session.user._id
        const loggedinUserOrders = await orderService.getByUserId(loggedInUserId)
        res.send(loggedinUserOrders)
    } catch (err) {
        logger.error('Failed to get loggedinUserOrders', err)
        res.status(500).send({ err: 'Failed to get loggedinUserOrders' })
    }
}


async function getOrders(req, res) {
    try {
        // const filterBy = {
        //     name: req.query.name || '',
        //     type: req.query.type || 'all',
        //     fromPrice: req.query.fromPrice || 0,
        //     toPrice: req.query.toPrice || null,
        //     type: req.query.type || 'all',
        //     isInStock: req.query.isInStock || null,
        // }
        const orders = await orderService.query()
        res.send(orders)
    } catch (err) {
        logger.error('Failed to get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function deleteOrder(req, res) {
    try {
        const { orderId } = req.params
        await orderService.remove(orderId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}

async function createOrder(req, res){
    try {
        const {title, status, createdAt, price, buyer, seller} = req.body
        const order = {
            title,
            status,
            createdAt: new Date(),
            price,
            buyer,
            seller,
        }
        const newOrder = await orderService.add(order)
        res.send(newOrder)
    } catch (err) {
        logger.error('Failed to create order', err)
        res.status(500).send({ err: 'Failed to create order' })
    }
}


async function updateOrder(req, res) {
    try {
        const {_id, title, status, createdAt, price, buyer, seller} = req.body
        const order = {
            _id,
            title,
            status,
            createdAt: new Date(),
            price,
            buyer,
            seller,
            
        }
        console.log(order)
        const savedOrder = await orderService.update(order)
        res.send(savedOrder)
        // socketService.broadcast({type: 'order-updated', data: review, to:savedOrder._id})
    } catch (err) {
        logger.error('Failed to update order', err)
        res.status(500).send({ err: 'Failed to update order' })
    }
}




module.exports = {
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
    createOrder,
    getOrdersByloggedinUserId
}