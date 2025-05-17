import { useEffect, useState } from 'react';
import api from '../api/api';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryName: '' });
  const [editingId, setEditingId] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await api.get('/public/categories');
      setCategories(res.data.content);
    } catch (err) {
      console.error("Błąd podczas ładowania kategorii", err);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (editingId) {
      await api.put(`/public/categories/${editingId}`, form, config);
    } else {
      await api.post('/public/categories', form, config);
    }

    setForm({ categoryName: '' });
    setEditingId(null);
    loadCategories();
  } catch (err) {
    console.error("Błąd podczas zapisywania kategorii", err);
    console.error("Szczegóły:", err.response?.data);
  }
};


  const handleEdit = (cat) => {
    setForm({ categoryName: cat.categoryName });
    setEditingId(cat.categoryId);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/categories/${id}`);
      loadCategories();
    } catch (err) {
      console.error("Błąd podczas usuwania kategorii", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Zarządzaj kategoriami</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
            Nazwa kategorii
          </label>
          <input
            id="categoryName"
            type="text"
            value={form.categoryName}
            onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
            placeholder="Nazwa kategorii"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editingId ? 'Aktualizuj' : 'Dodaj'}
        </button>
      </form>

      <ul>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li
              key={cat.categoryId}
              className="flex justify-between items-center p-4 mb-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <div>
                <strong className="text-lg">{cat.categoryName}</strong>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(cat.categoryId)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Usuń
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>Brak kategorii do wyświetlenia</p>
        )}
      </ul>
    </div>
  );
};

export default ManageCategories;
