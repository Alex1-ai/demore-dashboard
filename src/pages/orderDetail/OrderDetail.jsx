import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userRequest } from '../../requestMethods';
import './orderDetail.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const res = await userRequest.get(`orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedOrder = { ...order, status: newStatus };
      await userRequest.put(`orders/${orderId}`, updatedOrder);
      setOrder(updatedOrder);
    } catch (err) {
      console.error(`Failed to update order status to ${newStatus}:`, err);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="orderDetail">
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>User ID:</strong> {order.userId}</p>
      <p><strong>Amount:</strong> ${order.amount}</p>
      <p><strong>Address:</strong> {order.address.line1}, {order.address.city}, {order.address.country}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

      <h3>Products</h3>
      {order.products.map((product) => (
        <div key={product.productId} className="orderDetailProduct">
          <img className="orderDetailImg" src={product.img} alt={product.title} />
          <div>
            <p><strong>Title:</strong> {product.title}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
          </div>
        </div>
      ))}

      {/* Conditionally render the appropriate button based on the order status */}
      {order.status === 'pending' ? (
        <button
          onClick={() => handleStatusChange('delivered')}
          className="orderDetailButton"
        >
          Mark as Delivered
        </button>
      ) : (
        <button
          onClick={() => handleStatusChange('pending')}
          className="changeToPendingButton"
        >
          Change to Pending
        </button>
      )}
    </div>
  );
};

export default OrderDetail;
