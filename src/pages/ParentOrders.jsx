import React from 'react';
import { Package, Clock, CheckCircle, XCircle, User } from 'lucide-react';

const ParentOrders = () => {
  const orders = JSON.parse(localStorage.getItem('parentOrders')) || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm font-medium flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Processing
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium flex items-center gap-1">
            <XCircle className="h-4 w-4" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Orders</h1>
              <p className="text-gray-600">Track your uniform orders</p>
            </div>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-100 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{order.studentName}</h3>
                    <p className="text-sm text-gray-500">{order.school}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Grade/Class</p>
                    <p className="font-medium">{order.grade}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                    View Order Details
                  </button>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">No Orders Yet</h3>
                <p className="text-gray-500">Your uniform orders will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentOrders; 