import React, { useState } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'

function Orders({url}) {

    const [order, setOrder] = useState([])

    const fetchOrders = async () => {
        const response = await axios.get(`${url}/api/v1/order/all`)
        if (response.data.success) {
            setOrder(response.data.data)
            console.log(response.data.data)
        } else {
            toast.error("Failed to fetch orders")
        }  
    }

    const statusHandler = async (event, orderId) => {
      const response = await axios.post(`${url}/api/v1/order/status`, 
        { orderId, status: event.target.value })
      if (response.data.success) {
        toast.success("Order status updated successfully")
         await fetchOrders() // Refresh the orders list after updating status
      } else {
        toast.error("Failed to update order status")
      }
    }


    useEffect(() => {
        fetchOrders()
    }, [])

  return (
    <div className='orders add'>
      <h2>Orders Page</h2>
      <div className="order-list">
        {order.map((item, index) => {
          return (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className='order-item-food'>
                  {item.items.map((food, index) => {
                    if (index === item.items.length - 1) {
                      return food.name + " X " + food.quantity
                    } else {
                      return food.name + " X " + food.quantity + ", "
                    }
                  })}
                </p>
                <p className='order-item-name'>{item.address.firstName+" "+item.address.lastName}</p>
                <div className='order-item-address'>
                  <p>{item.address.street+","}</p>
                  <p>{item.address.city+","+item.address.state+","+item.address.country+","+item.address.zipcode}</p>
                </div>
                <p className="order-item-phone">{item.address.phone}</p>
              </div>
              <p className='order-item-items'>Items: {item.items.length}</p>
              <p className='order-item-amount'>${item.amount}.00</p>
              <select className='order-item-status' onChange={(event) => statusHandler(event,item._id)} value={item.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders