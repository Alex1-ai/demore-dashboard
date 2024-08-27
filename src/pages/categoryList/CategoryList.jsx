import React, { useEffect, useState } from 'react';
import { DataGrid } from "@material-ui/data-grid";
import { Link } from 'react-router-dom';
import { userRequest } from '../../requestMethods';
import './categoryList.css';

const CategoryList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await userRequest.get("categories");
        // Map categories to include a unique id and image
        const categories = res.data.map((category) => ({
          id: category._id,
          title: category.title,
          img: category.img, // Assuming the image URL is stored in category.img
        }));
        setData(categories);
      } catch (err) {
        console.error(err);
      }
    };
    getCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await userRequest.delete(`categories/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "img",
      headerName: "Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.row.img}
          alt={params.row.title}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <Link to={`/category/${params.row.id}`}>
            <button className="categoryListEdit">Edit</button>
          </Link>
          <button
            className="categoryListDelete"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="categoryList">
      <div className="categoryListHeader">
        <Link to="/category/create">
          <button className="categoryListEdit">Create</button>
        </Link>
      </div>
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

export default CategoryList;
