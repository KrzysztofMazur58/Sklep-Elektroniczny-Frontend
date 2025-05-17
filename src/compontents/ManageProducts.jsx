import { useEffect, useState } from 'react';
import api from '../api/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    discount: '',
    specialPrice: '',
    description: '',
    quantity: '',
    categoryId: '',
    image: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Ładowanie produktów
  const loadProducts = async (page) => {
    try {
      const res = await api.get('/public/products', {
        params: { pageNumber: page, pageSize: 2 },
      });

      const rawProducts = res.data.content || [];

      const newProducts = rawProducts.map((p) => ({
        id: p.productId,
        name: p.productName,
        price: p.price,
        discount: p.discount,
        specialPrice: p.specialPrice,
        quantity: p.quantity,
        description: p.description,
        image: p.image,
        categoryId: p.category?.categoryId || '', // lub p.category?.id - zależnie od API
      }));

      if (newProducts.length < 2) setHasMore(false);

      setProducts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const filtered = newProducts.filter((p) => !ids.has(p.id));
        return [...prev, ...filtered];
      });
    } catch (err) {
      console.error('Błąd ładowania produktów', err);
    }
  };

  // Ładowanie kategorii
  const loadCategories = async () => {
    try {
      const res = await api.get('/public/categories');
      const validCategories = (res.data.content || []).filter(
        (cat) => cat && cat.categoryId && cat.categoryName
      );
      setCategories(validCategories);
    } catch (err) {
      console.error('Błąd ładowania kategorii', err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      discount: product.discount,
      specialPrice: product.specialPrice,
      description: product.description,
      quantity: product.quantity,
      categoryId: product.categoryId || '',
      image: product.image || '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Błąd usuwania produktu', err);
    }
  };

  // Obsługa formularza
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Przygotuj dane do wysłania, konwertując wartości liczbowo
    const payload = {
      productName: form.name,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount) || 0,
      description: form.description,
      quantity: parseInt(form.quantity, 10),
      image: form.image,
    };

    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, { ...payload, categoryId: form.categoryId });
      } else {
        await api.post(`/admin/categories/${form.categoryId}/product`, payload);
      }
      setForm({
        name: '',
        price: '',
        discount: '',
        specialPrice: '',
        description: '',
        quantity: '',
        categoryId: '',
        image: '',
      });
      setEditingId(null);
      setProducts([]);
      setPageNumber(0);
      setHasMore(true);
    } catch (err) {
      console.error('Błąd zapisu produktu', err);
    }
  };

  // Paginacja
  const loadNextPage = () => {
    if (hasMore) setPageNumber((prev) => prev + 1);
  };

  // Inicjalizacja
  useEffect(() => {
    loadProducts(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Zarządzanie produktami</h2>

      {/* Formularz dodawania/edycji produktu */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nazwa
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nazwa produktu"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Cena
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Cena"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
            Rabat (%)
          </label>
          <input
            id="discount"
            type="number"
            step="0.01"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            placeholder="Rabat"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="specialPrice" className="block text-sm font-medium text-gray-700">
            Cena specjalna
          </label>
          <input
            id="specialPrice"
            type="number"
            step="0.01"
            value={form.specialPrice}
            readOnly
            placeholder="Cena specjalna wyliczana"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Ilość
          </label>
          <input
            id="quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder="Ilość"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            URL obrazka
          </label>
          <input
            id="image"
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="Adres URL obrazka"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Opis
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Opis produktu"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Kategoria
          </label>
          <select
            id="categoryId"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">-- Wybierz kategorię --</option>
            {categories.map((cat) => (
              <option key={`cat-${cat.categoryId}`} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {editingId ? 'Zaktualizuj' : 'Dodaj'}
        </button>
      </form>

      {/* Lista produktów */}
      <ul className="space-y-4">
        {products.map((prod) => (
          <li
            key={`prod-${prod.id}`}
            className="flex justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center">
              <img src={prod.image} alt={prod.name} width={50} className="mr-4" />
              <div>
                <strong className="text-lg">{prod.name}</strong>
                <p className="text-sm text-gray-600">{prod.description}</p>
                <p className="text-sm text-gray-500">
                  Cena: {prod.price} zł <br />
                  Rabat: {prod.discount}% <br />
                  Cena specjalna: {prod.specialPrice.toFixed(2)} zł <br />
                  Ilość: {prod.quantity} szt.
                </p>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(prod)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Edytuj
              </button>
              <button
                onClick={() => handleDelete(prod.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Usuń
              </button>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          onClick={loadNextPage}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
        >
          Załaduj więcej produktów
        </button>
      )}
    </div>
  );
};

export default ManageProducts;




