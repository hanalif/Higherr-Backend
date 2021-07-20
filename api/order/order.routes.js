const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {createOrder,getOrder, getOrders, deleteOrder, getOrdersByloggedinUserId, updateOrder} = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
// router.use(requireAdmin)


router.get('/', requireAuth, getOrders) //Orders List
router.post('/', requireAuth, createOrder)// Order Create
router.put('/', requireAuth, updateOrder) //Order Update
router.get('/:orderId', requireAuth, getOrder) //Order read single
router.get('/userOrders', getOrdersByloggedinUserId) //Order by loggedInUserId
router.delete('/:orderId', requireAuth, deleteOrder)//Order delete


module.exports = router