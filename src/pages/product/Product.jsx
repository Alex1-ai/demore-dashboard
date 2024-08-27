import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { useDispatch } from "react-redux";
import {
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
} from "../../redux/productRedux";



export default function Product() {
  const dispatch = useDispatch();

  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const [file, setFile] = useState(null);

  const [title, setTitle] = useState(product.title);
  const [desc, setDesc] = useState(product.desc);
  const [price, setPrice] = useState(product.price);
  const [inStock, setInStock] = useState(product.inStock);
  const [categories, setCategories] = useState(product.categories);
  const [size, setSize] = useState(product.size);
  const [color, setColor] = useState(product.color);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("orders/income?pid=" + productId);
        const list = res.data.sort((a, b) => {
          return a._id - b._id;
        });
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateProductStart());

    let updatedProduct = {
      title,
      desc,
      price,
      inStock,
      categories,
      size,
      color,
      img: product.img, // Use the existing image URL by default
    };

    if (file) {
      const fileName = new Date().getTime() + file.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading image:", error);
          alert("Failed to upload image.");
          dispatch(updateProductFailure());
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            updatedProduct.img = downloadURL;

            try {
              await userRequest.put(`products/${productId}`, updatedProduct);
              dispatch(updateProductSuccess({ id: productId, product: updatedProduct }));
              alert("Product updated successfully!");
            } catch (err) {
              console.error("Error updating product:", err);
              alert("Failed to update product.");
              dispatch(updateProductFailure());
            }
          });
        }
      );
    } else {
      try {
        await userRequest.put(`products/${productId}`, updatedProduct);
        dispatch(updateProductSuccess({ id: productId, product: updatedProduct }));
        alert("Product updated successfully!");
      } catch (err) {
        console.error("Error updating product:", err);
        alert("Failed to update product.");
        dispatch(updateProductFailure());
      }
    }
  };


  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">{product.inStock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Product Description</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <label>Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label>In Stock</label>
            <select
              name="inStock"
              id="idStock"
              value={inStock}
              onChange={(e) => setInStock(e.target.value)}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            <label>Category</label>
            <input
              type="text"
              value={categories.join(", ")}
              onChange={(e) => setCategories(e.target.value.split(","))}
            />
            <label>Size</label>
            <input
              type="text"
              value={size.join(", ")}
              onChange={(e) => setSize(e.target.value.split(","))}
            />
            <label>Color</label>
            <input
              type="text"
              value={color.join(", ")}
              onChange={(e) => setColor(e.target.value.split(","))}
            />
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.img} alt="" className="productUploadImg" />
              <label htmlFor="file">
                <Publish />
              </label>
              <input type="file" id="file" style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button className="productButton" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
