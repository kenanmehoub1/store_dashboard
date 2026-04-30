// app/orders/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X
} from "lucide-react";

// تعريف نوع البيانات
interface Order {
  id: string;
  orderId: string;
  customer: string;
  total: string;
  status: "pending" | "shipped" | "completed";
  createdAt: string;
}

// تعريف نوع البيانات للنموذج
interface NewOrder {
  customer: string;
  total: string;
  status: "pending" | "shipped" | "completed";
}

export default function OrdersPage() {
  const router = useRouter();
  
  // بيانات وهمية للطلبات
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderId: "#67554",
      customer: "Sara Ali",
      total: "$80.76",
      status: "pending",
      createdAt: "4/6/2026 2:00 PM"
    },
    {
      id: "2",
      orderId: "#67555",
      customer: "Ahmed Hassan",
      total: "$120.50",
      status: "completed",
      createdAt: "4/6/2026 1:30 PM"
    },
    {
      id: "3",
      orderId: "#67556",
      customer: "Fatima Khan",
      total: "$45.99",
      status: "shipped",
      createdAt: "4/6/2026 11:15 AM"
    },
    {
      id: "4",
      orderId: "#67557",
      customer: "Omar Farouk",
      total: "$230.00",
      status: "pending",
      createdAt: "4/5/2026 4:45 PM"
    },
    {
      id: "5",
      orderId: "#67558",
      customer: "Layla Mahmoud",
      total: "$67.30",
      status: "completed",
      createdAt: "4/5/2026 10:20 AM"
    },
    {
      id: "6",
      orderId: "#67559",
      customer: "Youssef Nabil",
      total: "$95.25",
      status: "shipped",
      createdAt: "4/4/2026 3:00 PM"
    },
    {
      id: "7",
      orderId: "#67560",
      customer: "Nour El-Din",
      total: "$150.00",
      status: "pending",
      createdAt: "4/4/2026 12:30 PM"
    },
    {
      id: "8",
      orderId: "#67561",
      customer: "Mariam Gamal",
      total: "$34.99",
      status: "completed",
      createdAt: "4/3/2026 2:15 PM"
    },
    {
      id: "9",
      orderId: "#67562",
      customer: "Khaled Tamer",
      total: "$189.99",
      status: "shipped",
      createdAt: "4/3/2026 9:45 AM"
    },
    {
      id: "10",
      orderId: "#67563",
      customer: "Rania Samir",
      total: "$76.50",
      status: "pending",
      createdAt: "4/2/2026 5:30 PM"
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState<NewOrder>({
    customer: "",
    total: "",
    status: "pending"
  });
  const [editOrder, setEditOrder] = useState<NewOrder>({
    customer: "",
    total: "",
    status: "pending"
  });

  const itemsPerPage = 5;

  // فلتر الطلبات حسب اسم العميل
  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حساب الصفحات
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // إعادة تعيين الصفحة إلى 1 عند تغيير البحث
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // مسح الفلتر
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // دالة الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "shipped":
        return <Truck className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  // دالة إضافة طلب جديد
  const handleAddOrder = () => {
    if (!newOrder.customer || !newOrder.total) {
      alert("Please fill in all fields");
      return;
    }

    // إنشاء ID جديد
    const newId = String(orders.length + 1);
    
    // إنشاء Order ID جديد
    const lastOrderId = orders[0]?.orderId || "#67553";
    const lastNumber = parseInt(lastOrderId.replace("#", ""));
    const newOrderId = `#${lastNumber + 1}`;
    
    // الحصول على التاريخ والوقت الحالي
    const now = new Date();
    const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    
    // إنشاء الطلب الجديد
    const orderToAdd: Order = {
      id: newId,
      orderId: newOrderId,
      customer: newOrder.customer,
      total: newOrder.total.startsWith('$') ? newOrder.total : `$${newOrder.total}`,
      status: newOrder.status,
      createdAt: formattedDate
    };
    
    // إضافة الطلب في بداية القائمة
    setOrders([orderToAdd, ...orders]);
    
    // إغلاق المودال وتصفية النموذج
    setIsAddModalOpen(false);
    setNewOrder({
      customer: "",
      total: "",
      status: "pending"
    });
    
    // العودة إلى الصفحة الأولى
    setCurrentPage(1);
  };

  // دالة فتح مودال التعديل
  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditOrder({
      customer: order.customer,
      total: order.total.replace('$', ''),
      status: order.status
    });
    setIsEditModalOpen(true);
  };

  // دالة حفظ التعديلات
  const handleEditOrder = () => {
    if (!editOrder.customer || !editOrder.total) {
      alert("Please fill in all fields");
      return;
    }

    const updatedOrders = orders.map(order => 
      order.id === selectedOrder?.id 
        ? {
            ...order,
            customer: editOrder.customer,
            total: editOrder.total.startsWith('$') ? editOrder.total : `$${editOrder.total}`,
            status: editOrder.status,
          }
        : order
    );
    
    setOrders(updatedOrders);
    setIsEditModalOpen(false);
    setSelectedOrder(null);
    setEditOrder({
      customer: "",
      total: "",
      status: "pending"
    });
  };

  // دالة فتح مودال الحذف
  const openDeleteModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  // دالة حذف الطلب
  const handleDeleteOrder = () => {
    const updatedOrders = orders.filter(order => order.id !== selectedOrder?.id);
    setOrders(updatedOrders);
    setIsDeleteModalOpen(false);
    setSelectedOrder(null);
    
    // إذا كانت الصفحة الحالية فارغة بعد الحذف، انتقل للصفحة السابقة
    const newFilteredOrders = updatedOrders.filter(order =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const newTotalPages = Math.ceil(newFilteredOrders.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="p-6">
      {/* العنوان */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your orders and track their status
        </p>
      </div>

      {/* شريط الفلتر والزر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Filter by customer:
          </label>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Found {filteredOrders.length} result(s)
            </span>
          )}
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Order</span>
        </button>
      </div>

      {/* الجدول */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {order.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(order)}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          title="Edit Order"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(order)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p>No orders found for "{searchTerm}"</p>
                      <button
                        onClick={clearSearch}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Clear search
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* أزرار التنقل Previous/Next */}
        {filteredOrders.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal لإضافة طلب جديد */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Order
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                  placeholder="Enter customer name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Amount *
                </label>
                <input
                  type="text"
                  value={newOrder.total}
                  onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value })}
                  placeholder="Enter total amount (e.g., 150.00)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={newOrder.status}
                  onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as "pending" | "shipped" | "completed" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal لتعديل طلب */}
      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Order {selectedOrder.orderId}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={editOrder.customer}
                  onChange={(e) => setEditOrder({ ...editOrder, customer: e.target.value })}
                  placeholder="Enter customer name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Amount *
                </label>
                <input
                  type="text"
                  value={editOrder.total}
                  onChange={(e) => setEditOrder({ ...editOrder, total: e.target.value })}
                  placeholder="Enter total amount (e.g., 150.00)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={editOrder.status}
                  onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value as "pending" | "shipped" | "completed" })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOrder}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal تأكيد الحذف */}
      {isDeleteModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Delete Order
              </h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Do you really want to delete order {selectedOrder.orderId} for "{selectedOrder.customer}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrder}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}