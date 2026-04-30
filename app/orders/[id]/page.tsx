// app/orders/[id]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Package, 
  User, 
  Mail, 
  Clock,
  Truck,
  CheckCircle,
  Users,
  Phone,
  MapPin
} from "lucide-react";

// تعريف نوع البيانات
interface Order {
  id: string;
  orderId: string;
  customer: string;
  total: string;
  status: "pending" | "shipped" | "completed";
  createdAt: string;
  email?: string;
  username?: string;
  phone?: string;
  address?: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // دالة للعثور على ID المستخدم بناءً على الإيميل
  const getUserIdByEmail = (email: string) => {
    // بيانات المستخدمين (نفس البيانات من صفحة Users)
    const usersData = [
      { id: "1", email: "sara.ali@example.com", name: "Sara Ali" },
      { id: "2", email: "ahmed.hassan@example.com", name: "Ahmed Hassan" },
      { id: "3", email: "fatima.khan@example.com", name: "Fatima Khan" },
      { id: "4", email: "omar.farouk@example.com", name: "Omar Farouk" },
      { id: "5", email: "layla.mahmoud@example.com", name: "Layla Mahmoud" },
      { id: "6", email: "youssef.nabil@example.com", name: "Youssef Nabil" },
      { id: "7", email: "nour.eldin@example.com", name: "Nour El-Din" },
      { id: "8", email: "mariam.gamal@example.com", name: "Mariam Gamal" },
      { id: "9", email: "khaled.tamer@example.com", name: "Khaled Tamer" },
      { id: "10", email: "rania.samir@example.com", name: "Rania Samir" }
    ];
    
    const user = usersData.find(u => u.email === email);
    return user ? user.id : "1"; // إذا لم يتم العثور على المستخدم، ارجع إلى المستخدم رقم 1
  };

  // بيانات وهمية للطلبات (نفس البيانات من صفحة Orders)
  const ordersData: Order[] = [
    {
      id: "1",
      orderId: "#67554",
      customer: "Sara Ali",
      total: "$80.76",
      status: "pending",
      createdAt: "4/6/2026 2:00 PM",
      email: "sara.ali@example.com",
      username: "sara_ali",
      phone: "+1 234 567 8901",
      address: "123 Main St, New York, NY 10001"
    },
    {
      id: "2",
      orderId: "#67555",
      customer: "Ahmed Hassan",
      total: "$120.50",
      status: "completed",
      createdAt: "4/6/2026 1:30 PM",
      email: "ahmed.hassan@example.com",
      username: "ahmed_h",
      phone: "+1 234 567 8902",
      address: "456 Oak Ave, Los Angeles, CA 90001"
    },
    {
      id: "3",
      orderId: "#67556",
      customer: "Fatima Khan",
      total: "$45.99",
      status: "shipped",
      createdAt: "4/6/2026 11:15 AM",
      email: "fatima.khan@example.com",
      username: "fatima_k",
      phone: "+1 234 567 8903",
      address: "789 Pine Rd, Chicago, IL 60601"
    },
    {
      id: "4",
      orderId: "#67557",
      customer: "Omar Farouk",
      total: "$230.00",
      status: "pending",
      createdAt: "4/5/2026 4:45 PM",
      email: "omar.farouk@example.com",
      username: "omar_f",
      phone: "+1 234 567 8904",
      address: "321 Elm St, Houston, TX 77001"
    },
    {
      id: "5",
      orderId: "#67558",
      customer: "Layla Mahmoud",
      total: "$67.30",
      status: "completed",
      createdAt: "4/5/2026 10:20 AM",
      email: "layla.mahmoud@example.com",
      username: "layla_m",
      phone: "+1 234 567 8905",
      address: "654 Maple Dr, Phoenix, AZ 85001"
    },
    {
      id: "6",
      orderId: "#67559",
      customer: "Youssef Nabil",
      total: "$95.25",
      status: "shipped",
      createdAt: "4/4/2026 3:00 PM",
      email: "youssef.nabil@example.com",
      username: "youssef_n",
      phone: "+1 234 567 8906",
      address: "987 Cedar Ln, Philadelphia, PA 19101"
    },
    {
      id: "7",
      orderId: "#67560",
      customer: "Nour El-Din",
      total: "$150.00",
      status: "pending",
      createdAt: "4/4/2026 12:30 PM",
      email: "nour.eldin@example.com",
      username: "nour_eldin",
      phone: "+1 234 567 8907",
      address: "147 Birch Way, San Antonio, TX 78201"
    },
    {
      id: "8",
      orderId: "#67561",
      customer: "Mariam Gamal",
      total: "$34.99",
      status: "completed",
      createdAt: "4/3/2026 2:15 PM",
      email: "mariam.gamal@example.com",
      username: "mariam_g",
      phone: "+1 234 567 8908",
      address: "258 Spruce St, San Diego, CA 92101"
    },
    {
      id: "9",
      orderId: "#67562",
      customer: "Khaled Tamer",
      total: "$189.99",
      status: "shipped",
      createdAt: "4/3/2026 9:45 AM",
      email: "khaled.tamer@example.com",
      username: "khaled_t",
      phone: "+1 234 567 8909",
      address: "369 Willow Ct, Dallas, TX 75201"
    },
    {
      id: "10",
      orderId: "#67563",
      customer: "Rania Samir",
      total: "$76.50",
      status: "pending",
      createdAt: "4/2/2026 5:30 PM",
      email: "rania.samir@example.com",
      username: "rania_s",
      phone: "+1 234 567 8910",
      address: "741 Ash Ave, San Jose, CA 95101"
    }
  ];

  useEffect(() => {
    // العثور على الطلب المطلوب
    const foundOrder = ordersData.find(order => order.id === orderId);
    setOrder(foundOrder || null);
    setLoading(false);
  }, [orderId]);

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
        return <Clock className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* زر الرجوع والعنوان */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Orders
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* البطاقة الأولى - معلومات الطلب */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Order Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* الجانب الأيسر */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-medium">Order ID</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {order.orderId}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Placed On</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.createdAt}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Total Amount</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {order.total}
                </p>
              </div>
            </div>
            
            {/* الجانب الأيمن */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Created At</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.createdAt}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* البطاقة الثانية - معلومات العميل */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Customer Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* الجانب الأيسر */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Full Name</span>
                </div>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {order.customer}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Username</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.username || "N/A"}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">Phone Number</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.phone || "N/A"}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">Shipping Address</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.address || "N/A"}
                </p>
              </div>

              {/* زر View Customer Profile المعدل */}
              <button 
                onClick={() => {
                  if (order.email) {
                    const userId = getUserIdByEmail(order.email);
                    router.push(`/users/${userId}`);
                  } else {
                    // إذا لم يوجد إيميل، اذهب إلى صفحة المستخدمين
                    router.push(`/users`);
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                View Customer Profile
              </button>
            </div>
            
            {/* الجانب الأيمن */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">Email Address</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {order.email || "N/A"}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Customer Status</span>
                </div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}