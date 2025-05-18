import { useEffect, useState } from 'react';
import api from '../api/api';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/orders');
      console.log('Pobrane zamówienia:', res.data);
      setOrders(res.data || []);
    } catch (err) {
      console.error('Błąd ładowania zamówień użytkownika', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Moje zamówienia</h2>

      {loading ? (
        <p>Ładowanie zamówień...</p>
      ) : orders.length === 0 ? (
        <p>Nie masz jeszcze żadnych zamówień.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.orderId} className="border p-4 rounded-md shadow-sm">
              <div>
                <strong>Zamówienie #{order.orderId}</strong> - Status: {order.status}
              </div>
              <div className="text-sm text-gray-700">
                Data: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Brak daty'}
              </div>
              <div className="mt-2">
                <strong>Produkty:</strong>
                <ul className="list-disc ml-6 text-sm">
                  {order.orderElements?.map((item, idx) => (
                    <li key={item.id || idx}>
                      {item.product && item.product.productName ? item.product.productName : 'Brak nazwy produktu'} – {item.quantity} szt. – {item.orderedProductPrice.toFixed(2)} zł
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserOrders;


