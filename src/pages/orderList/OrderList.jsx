import React, { useEffect, useState } from 'react';
import { DataGrid } from "@material-ui/data-grid";
import { Link } from 'react-router-dom';
import { userRequest } from '../../requestMethods';
import './orderList.css';

const OrderList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await userRequest.get("orders");
        // Map orders to include a unique id and formatted address
        const orders = res.data.map((order) => ({
          id: order._id,
          userId: order.userId,
          firstProductImg: order.products[0]?.img || "/placeholder.png", // Use first product image or placeholder
          amount: order.amount,
          address: `${order.address.line1}, ${order.address.country}`,
          status: order.status,
          createdAt: order.createdAt,
        }));
        setData(orders);
      } catch (err) {
        console.error(err);
      }
    };
    getOrders();
  }, []);

  const columns = [
    { field: "id", headerName: "Order ID", width: 220 },
    { field: "userId", headerName: "User ID", width: 220 },
    {
      field: "firstProductImg",
      headerName: "Product Image",
      width: 100,
      renderCell: (params) => (
        <img className="orderListImg" src={params.value} alt="Product" />
      ),
    },
    { field: "amount", headerName: "Amount ($)", width: 150 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "createdAt", headerName: "Date", width: 200 },
    {
      field: "details",
      headerName: "Details",
      width: 150,
      renderCell: (params) => (
        <Link to={`/orders/${params.row.id}`}>
          <button className="orderListEdit">View Details</button>
        </Link>
      ),
    },
  ];

  return (
    <div className="orderList">
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={8}
        autoHeight
        disableSelectionOnClick
        checkboxSelection
      />
    </div>
  );
};

export default OrderList;
