import { useEffect, useState } from 'react';
import api from '../api/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    discount: '',
    description: '',
    quantity: '',
    categoryId: '',
    // usuwamy tu image URL
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = async (page) => {
    try {
      const res = await api.get('/public/products', {
        params: { pageNumber: page, pageSize: 5 },
      });
      const raw = res.data.content || [];
      const mapped = raw.map(p => ({
        id: p.productId,
        name: p.productName,
        price: p.price,
        discount: p.discount,
        specialPrice: p.specialPrice,
        quantity: p.quantity,
        description: p.description,
        image: p.image,
        categoryId: p.category?.categoryId || '',
      }));
      if (mapped.length < 5) setHasMore(false);
      setProducts(prev => {
        const ids = new Set(prev.map(x => x.id));
        return [...prev, ...mapped.filter(x => !ids.has(x.id))];
      });
    } catch (err) {
      console.error('Błąd ładowania produktów', err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get('/public/categories');
      setCategories(res.data.content || []);
    } catch (err) {
      console.error('Błąd ładowania kategorii', err);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      discount: p.discount,
      description: p.description,
      quantity: p.quantity,
      categoryId: p.categoryId,
    });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Błąd usuwania produktu', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      productName: form.name,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount) || 0,
      description: form.description,
      quantity: parseInt(form.quantity, 10),
      // kategoria przekazujemy tylko przy tworzeniu
    };

    try {
      let saved;
      if (editingId) {
        // Aktualizacja metadanych
        saved = await api.put(`/admin/products/${editingId}`, {
          ...payload,
          categoryId: form.categoryId
        });
      } else {
        // Tworzenie nowego
        saved = await api.post(`/admin/categories/${form.categoryId}/product`, payload);
      }
      const productId = saved.data.productId;

      // Jeżeli wybrano plik, upload obrazka
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        await api.put(`/products/${productId}/image`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // reset formy
      setForm({
        name: '',
        price: '',
        discount: '',
        description: '',
        quantity: '',
        categoryId: '',
      });
      setImageFile(null);
      setEditingId(null);
      // odświeżenie listy
      setProducts([]);
      setPageNumber(0);
      setHasMore(true);
    } catch (err) {
      console.error('Błąd zapisu produktu', err);
    }
  };

  const loadNextPage = () => {
    if (hasMore) setPageNumber(prev => prev + 1);
  };

  useEffect(() => {
    loadProducts(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Zarządzanie produktami</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        {/* Nazwa */}
        <div>
          <label className="block text-sm font-medium">Nazwa</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
        {/* Cena */}
        <div>
          <label className="block text-sm font-medium">Cena</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
        {/* Rabat */}
        <div>
          <label className="block text-sm font-medium">Rabat (%)</label>
          <input
            type="number"
            step="0.01"
            value={form.discount}
            onChange={e => setForm({...form, discount: e.target.value})}
            className="w-full p-3 border rounded-md"
          />
        </div>
        {/* Ilość */}
        <div>
          <label className="block text-sm font-medium">Ilość</label>
          <input
            type="number"
            value={form.quantity}
            onChange={e => setForm({...form, quantity: e.target.value})}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
        {/* Opis */}
        <div>
          <label className="block text-sm font-medium">Opis</label>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            required
            className="w-full p-3 border rounded-md"
          />
        </div>
        {/* Kategoria */}
        <div>
          <label className="block text-sm font-medium">Kategoria</label>
          <select
            value={form.categoryId}
            onChange={e => setForm({...form, categoryId: e.target.value})}
            required
            className="w-full p-3 border rounded-md"
          >
            <option value="">-- wybierz --</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>
        {/* Upload obrazka */}
        <div>
          <label className="block text-sm font-medium">Obrazek</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md"
        >
          {editingId ? 'Zaktualizuj' : 'Dodaj'}
        </button>
      </form>

      {/* Lista produktów */}
      <ul className="space-y-4">
        {products.map(prod => (
          <li key={prod.id} className="flex justify-between items-center p-4 border rounded-md">
            <div className="flex items-center">
              <img src={prod.image} alt="" width={50} className="mr-4" />
              <div>
                <strong>{prod.name}</strong>
                <p>{prod.description}</p>
                <p>
                  Cena: {prod.price} zł | Rabat: {prod.discount}% | Specjalna: {prod.specialPrice.toFixed(2)} zł | Ilość: {prod.quantity}
                </p>
              </div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(prod)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">
                Edytuj
              </button>
              <button onClick={() => handleDelete(prod.id)} className="px-4 py-2 bg-red-500 text-white rounded-md">
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button onClick={loadNextPage} className="w-full py-3 bg-blue-600 text-white rounded-md mt-4">
          Załaduj więcej
        </button>
      )}
    </div>
  );
};

export default ManageProducts;
