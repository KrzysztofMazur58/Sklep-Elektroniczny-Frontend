import { useEffect, useState } from 'react';
import api from '../api/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      console.log('Orders data:', res.data);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Błąd ładowania zamówień', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      loadOrders();
    } catch (err) {
      console.error('Błąd zmiany statusu', err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const statusOptions = ['NOWE', 'W TRAKCIE', 'ZAKOŃCZONE'];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Zarządzaj zamówieniami</h2>

      {loading ? (
        <p>Ładowanie zamówień...</p>
      ) : orders.length === 0 ? (
        <p>Brak zamówień do wyświetlenia</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.orderId}
              className="border p-4 rounded-md shadow-sm hover:bg-gray-50"
            >
              <div className="mb-2">
                <strong>Zamówienie #{order.orderId}</strong> - {order.status}
              </div>
              <div className="mb-2 text-sm text-gray-700">
                Użytkownik: {order.email || 'Nieznany'} <br />
                Data: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Brak daty'} <br />
                Suma: {order.totalPrice ? order.totalPrice.toFixed(2) + ' zł' : 'Brak sumy'}
              </div>
              <div className="mb-2">
                <strong>Produkty:</strong>
                <ul className="list-disc ml-6 text-sm">
                  {order.orderElements?.map((item, index) => (
                    <li key={item.id || index}>
                      {item.product?.name || 'Produkt'} – {item.quantity} szt. – {item.orderedProductPrice.toFixed(2)} zł
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <label htmlFor={`status-${order.orderId}`} className="text-sm">
                  Zmień status:
                </label>
                <select
                  id={`status-${order.orderId}`}
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                  className="border px-2 py-1 rounded-md"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageOrders;

