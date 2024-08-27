import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userRequest } from '../../requestMethods';
import './categoryDetail.css';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [title, setTitle] = useState('');


  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await userRequest.get(`categories/find/${categoryId}`);
        setCategory(res.data);
        setTitle(res.data.title);
      } catch (err) {
        console.error(err.message);
      }
    };
    getCategory();
  }, [categoryId]);

  const handleUpdate = async () => {
    try {
      await userRequest.put(`categories/${categoryId}`, { title });
      alert('Category updated successfully');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await userRequest.delete(`categories/${categoryId}`);
      alert('Category deleted successfully');
      navigate('/categories');
    } catch (err) {
      console.error(err);
    }
  };

  if (!category) return <div>Loading...</div>;

  return (
    <div className="categoryDetail">
      <h2>Category Detail</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <button onClick={handleUpdate} className="categoryDetailUpdate">
        Update
      </button>
      <button onClick={handleDelete} className="categoryDetailDelete">
        Delete
      </button>
    </div>
  );
};

export default CategoryDetail;
