import { useState } from "react";
import "./newProduct.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../firebase";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [message, setMessage] = useState(""); // State to manage the success/error message
  const [messageType, setMessageType] = useState(""); // State to manage the message type (success or error)
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleCat = (e) => {
    setCat(e.target.value.split(","));
  };

  const handleColor = (e) => {
    setColor(e.target.value.split(","));
  };

  const handleSize = (e) => {
    setSize(e.target.value.split(","));

  };



  const handleClick = (e) => {
    e.preventDefault();
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
        // Handle unsuccessful uploads
        console.error(error);
        setMessage("Error: " + error.message);
        setMessageType("error");
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 50000); // Remove message after 30 seconds
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = { ...inputs, img: downloadURL, size: size, color:color, categories: cat };
          addProduct(product, dispatch);
          setMessage("Product added successfully!");
          console.log("downloaded message ",downloadURL)
          setMessageType("success");
          setTimeout(() => {
            setMessage("");
            setMessageType("");
          }, 50000); // Remove message after 30 seconds

          // Clear all input fields
          // setInputs({});
          // setFile(null);
          // setCat([]);
        });
      }
    );
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Apple Airpods"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            name="desc"
            type="text"
            placeholder="description..."
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input
            name="price"
            type="number"
            placeholder="100"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Colors</label>
          <input type="text" placeholder="red, yellow, black, pink" onChange={handleColor} />
        </div>
        <div className="addProductItem">
          <label>Size</label>
          <input type="text" placeholder="X, SM, XL, L" onChange={handleSize} />
        </div>
        <div className="addProductItem">
          <label>Categories</label>
          <input type="text" placeholder="jeans,skirts" onChange={handleCat} />
        </div>
        <div className="addProductItem">
          <label>Stock</label>
          <select name="inStock" onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "5px",
            color: "#fff",
            backgroundColor: messageType === "success" ? "teal" : "red",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
        <button onClick={handleClick} className="addProductButton">
          Create
        </button>
      </form>


    </div>
  );
}
