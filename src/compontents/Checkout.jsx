import { useEffect, useState } from "react";
import api from '../api/api';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

const Checkout = () => {
  const { cart } = useSelector((state) => state.carts);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({ city: "", street: "", number: "", pincode: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/users/addresses");
      setAddresses(res.data);
    } catch (error) {
      console.error("Error fetching addresses", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await api.post("/addresses", newAddress);
      setAddresses([...addresses, res.data]);
      setNewAddress({ city: "", street: "", number: "", pincode: "" });
    } catch (error) {
      console.error("Error adding address", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(addresses.filter((a) => a.addressId !== id));
    } catch (error) {
      console.error("Error deleting address", error);
    }
  };

  const handleOrder = async () => {
    try {
      const orderRequest = {
        addressId: selectedAddressId,
        paymentGatewayName: "fakeGateway",
        gatewayPaymentId: "000000000",
        gatewayStatus: "SUCCESS",
        gatewayResponseMessage: "Fake payment"
      };

      console.log("➡️ Sending order request:", orderRequest);

      const res = await api.post("/order/users/payments/fake", orderRequest);
      console.log("✅ Order saved:", res.data);
      navigate("/orders");
    } catch (error) {
      console.error("❌ Error creating order", error);
      console.log("📦 Response data:", error.response?.data);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Select Delivery Address</h1>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.addressId} className={`p-4 border rounded ${selectedAddressId === address.addressId ? "border-blue-600" : "border-gray-300"}`}>
            <input
              type="radio"
              name="selectedAddress"
              checked={selectedAddressId === address.addressId}
              onChange={() => setSelectedAddressId(address.addressId)}
              className="mr-2"
            />
            <span>{address.street} {address.number}, {address.city}, {address.pincode}</span>
            <button
              onClick={() => handleDeleteAddress(address.addressId)}
              className="ml-4 text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Add New Address</h2>
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="City"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Street"
            value={newAddress.street}
            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Number"
            value={newAddress.number}
            onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Postal Code"
            value={newAddress.pincode}
            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <button onClick={handleAddAddress} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
          Add Address
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>{formatPrice(cart.reduce((acc, item) => acc + item.specialPrice * item.quantity, 0))}</span>
        </div>

        <button
          disabled={!selectedAddressId}
          onClick={handleOrder}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded w-full hover:bg-blue-700 disabled:bg-gray-400"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;


