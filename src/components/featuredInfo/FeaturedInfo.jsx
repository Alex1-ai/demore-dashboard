import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function FeaturedInfo() {
  const [orders, setOrders] = useState([]);
  const [income, setIncome] = useState([]);
  const [perc, setPerc] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [deliveredOrders, setDeliveredOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await userRequest.get("orders");
        setOrders(res.data);

        // Calculate total revenue and count of delivered and pending orders
        const totalRevenue = res.data.reduce((acc, order) => acc + order.amount, 0);
        const delivered = res.data.filter(order => order.status === "delivered").length;
        const pending = res.data.filter(order => order.status === "pending").length;

        setTotalRevenue(totalRevenue);
        setDeliveredOrders(delivered);
        setPendingOrders(pending);
      } catch (e) {
        console.log("Error fetching orders data:", e);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const getIncome = async () => {
      try {
        const res = await userRequest.get("orders/income");
        setIncome(res.data);

        if (res.data.length === 1) {
          setPerc(0); // No comparison possible, set percentage change to 0
        } else {
          setPerc((res.data[1]?.total * 100) / res.data[0]?.total - 100);
        }
      } catch (e) {
        console.log("Error fetching income data:", e);
      }
    };
    getIncome();
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Total Revenue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${totalRevenue.toFixed(2)}</span>
          <span className="featuredMoneyRate">
            %{Math.floor(perc)}{" "}
            {perc < 0 ? (
              <ArrowDownward className="featuredIcon negative" />
            ) : (
              <ArrowUpward className="featuredIcon" />
            )}
          </span>
        </div>
        <span className="featuredSub">Total Generated Revenue</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Delivered Orders</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{deliveredOrders}</span>
          <span className="featuredMoneyRate">
            {deliveredOrders} delivered
          </span>
        </div>
        <span className="featuredSub">Total delivered orders</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Pending Orders</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{pendingOrders}</span>
          <span className="featuredMoneyRate">
            {pendingOrders} pending
          </span>
        </div>
        <span className="featuredSub">Total pending orders</span>
      </div>
    </div>
  );
}
