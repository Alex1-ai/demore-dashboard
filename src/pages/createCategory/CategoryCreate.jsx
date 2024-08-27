import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";
import { userRequest } from "../../requestMethods";
import "./categoryCreate.css";

export default function CategoryCreate() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(""); // State to manage the success/error message
  const [messageType, setMessageType] = useState(""); // State to manage the message type (success or error)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please upload an image.");
      setMessageType("error");
      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 30000); // Remove message after 30 seconds
      return;
    }

    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        }, 30000); // Remove message after 30 seconds
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const category = { ...inputs, img: downloadURL };
          try {
             await userRequest.post("categories", category);
            setMessage("Category created successfully!");
            setMessageType("success");
            setTimeout(() => {
              setMessage("");
              setMessageType("");
            }, 30000); // Remove message after 30 seconds

            navigate("/categories"); // Redirect to the category list
          } catch (e) {
            setMessage(`Error: ${e.message}!`);
            setMessageType("error");
            setTimeout(() => {
              setMessage("");
              setMessageType("");
            }, 30000);
          }
        });
      }
    );
  };

  return (
    <div className="categoryCreate">
      <h1 className="addCategoryTitle">Create New Category</h1>
      <form className="addCategoryForm">
        <div className="addCategoryItem">
          <label>Image</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <div className="addCategoryItem">
          <label>Title</label>
          <input
            name="title"
            type="text"
            placeholder="Category Name"
            onChange={handleChange}
          />
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
        <button onClick={handleClick} className="addCategoryButton">
          Create
        </button>
      </form>
    </div>
  );
}
