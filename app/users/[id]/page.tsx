// app/users/[id]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  User, 
  Clock,
  CheckCircle,
  XCircle,
  Users,
  AtSign,
  Briefcase,
  Activity
} from "lucide-react";

// تعريف نوع البيانات
interface User {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  status: "active" | "inactive";
  role: "admin" | "user" | "moderator";
  updatedAt: string;
  createdAt: string;
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // بيانات وهمية للمستخدمين
  const usersData: User[] = [
    {
      id: "1",
      email: "sara.ali@example.com",
      userName: "sara_ali",
      firstName: "Sara",
      lastName: "Ali",
      dateOfBirth: "1990-05-15",
      status: "active",
      role: "admin",
      updatedAt: "4/6/2026 10:30 AM",
      createdAt: "1/15/2025 9:00 AM"
    },
    {
      id: "2",
      email: "ahmed.hassan@example.com",
      userName: "ahmed_h",
      firstName: "Ahmed",
      lastName: "Hassan",
      dateOfBirth: "1988-08-22",
      status: "active",
      role: "user",
      updatedAt: "4/5/2026 2:15 PM",
      createdAt: "2/20/2025 11:30 AM"
    },
    {
      id: "3",
      email: "fatima.khan@example.com",
      userName: "fatima_k",
      firstName: "Fatima",
      lastName: "Khan",
      dateOfBirth: "1995-03-10",
      status: "inactive",
      role: "moderator",
      updatedAt: "4/4/2026 9:45 AM",
      createdAt: "3/10/2025 2:00 PM"
    },
    {
      id: "4",
      email: "omar.farouk@example.com",
      userName: "omar_f",
      firstName: "Omar",
      lastName: "Farouk",
      dateOfBirth: "1992-11-30",
      status: "active",
      role: "user",
      updatedAt: "4/6/2026 11:20 AM",
      createdAt: "1/5/2025 10:15 AM"
    },
    {
      id: "5",
      email: "layla.mahmoud@example.com",
      userName: "layla_m",
      firstName: "Layla",
      lastName: "Mahmoud",
      dateOfBirth: "1993-07-18",
      status: "active",
      role: "admin",
      updatedAt: "4/3/2026 3:30 PM",
      createdAt: "2/28/2025 1:45 PM"
    },
    {
      id: "6",
      email: "youssef.nabil@example.com",
      userName: "youssef_n",
      firstName: "Youssef",
      lastName: "Nabil",
      dateOfBirth: "1991-09-25",
      status: "inactive",
      role: "user",
      updatedAt: "4/2/2026 8:00 AM",
      createdAt: "3/25/2025 4:20 PM"
    },
    {
      id: "7",
      email: "nour.eldin@example.com",
      userName: "nour_eldin",
      firstName: "Nour",
      lastName: "El-Din",
      dateOfBirth: "1994-12-05",
      status: "active",
      role: "moderator",
      updatedAt: "4/6/2026 1:10 PM",
      createdAt: "1/30/2025 9:30 AM"
    },
    {
      id: "8",
      email: "mariam.gamal@example.com",
      userName: "mariam_g",
      firstName: "Mariam",
      lastName: "Gamal",
      dateOfBirth: "1996-02-14",
      status: "active",
      role: "user",
      updatedAt: "4/5/2026 12:00 PM",
      createdAt: "2/10/2025 11:00 AM"
    },
    {
      id: "9",
      email: "khaled.tamer@example.com",
      userName: "khaled_t",
      firstName: "Khaled",
      lastName: "Tamer",
      dateOfBirth: "1989-04-08",
      status: "inactive",
      role: "user",
      updatedAt: "4/1/2026 4:45 PM",
      createdAt: "3/5/2025 2:30 PM"
    },
    {
      id: "10",
      email: "rania.samir@example.com",
      userName: "rania_s",
      firstName: "Rania",
      lastName: "Samir",
      dateOfBirth: "1997-10-20",
      status: "active",
      role: "admin",
      updatedAt: "4/6/2026 9:15 AM",
      createdAt: "1/20/2025 8:45 AM"
    }
  ];

  useEffect(() => {
    const foundUser = usersData.find(user => user.id === userId);
    setUser(foundUser || null);
    setLoading(false);
  }, [userId]);

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // دالة الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  // دالة الحصول على لون الدور
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "moderator":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "user":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Go back
        </button>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* زر الرجوع */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Users
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* البطاقة الأولى - معلومات المستخدم الأساسية */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            User Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* الجانب الأيسر */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Full Name</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {fullName}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <AtSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Username</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {user.userName}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Date of Birth</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {user.dateOfBirth}
                </p>
              </div>
            </div>
            
            {/* الجانب الأيمن */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">Email Address</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm font-medium">Role</span>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  <Users className="h-3 w-3" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Account Status</span>
                </div>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                  {getStatusIcon(user.status)}
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* البطاقة الثانية - التواريخ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Account Timeline
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">Created At</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {user.createdAt}
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {user.updatedAt}
              </p>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات السريعة */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => router.push(`/users`)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Back to List
          </button>
          <button
            onClick={() => router.push(`/users?edit=${user.id}`)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            Edit User
          </button>
        </div>
      </div>
    </div>
  );
}