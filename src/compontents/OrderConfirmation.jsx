import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Thank you for your purchase!</h1>
      <p className="text-lg mb-6">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;
