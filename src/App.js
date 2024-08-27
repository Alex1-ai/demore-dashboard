import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./App.css";
import Home from "./pages/home/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";
import { useSelector } from "react-redux";
import OrderList from "./pages/orderList/OrderList";
import OrderDetail from "./pages/orderDetail/OrderDetail";
import CategoryList from "./pages/categoryList/CategoryList";
import CategoryDetail from "./pages/categoryDetail/CategoryDetail";
import CategoryCreate from "./pages/createCategory/CategoryCreate";

function App() {
  const admin = useSelector((state) => state.user.currentUser?.isAdmin);

  return (
    <Router>
      {admin && <Topbar />}  {/* Move Topbar outside Routes */}
      <div className="container">
        {admin && <Sidebar />}  {/* Move Sidebar outside Routes */}
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          {admin && (
            <>
              <Route exact path="/admin/" element={<Home />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/user/:userId" element={<User />} />
              <Route path="/admin/newUser" element={<NewUser />} />
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/product/:productId" element={<Product />} />
              <Route path="/admin/newproduct" element={<NewProduct />} />
              <Route path="/admin/orders" element={<OrderList /> } />
              <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
              <Route path="/admin/categories" element={<CategoryList /> } />
              <Route path="/admin/category/:categoryId" element={<CategoryDetail />} />
              <Route path="/admin/category/create" element={<CategoryCreate /> } />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
