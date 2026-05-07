"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Package,
  DollarSign,
  X,
  TrendingUp,
  Calculator,
} from "lucide-react";

interface Product {
  id: number;
  productName: string;
  priceUSD: number;
  priceSYP: number;
  createdAt: string;
  updatedAt: string;
}

interface NewProduct {
  productName: string;
  priceUSD: number;
}

export default function ProductsPage() {
  const [exchangeRate, setExchangeRate] = useState(12500);
  const [tempExchangeRate, setTempExchangeRate] = useState(12500);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    productName: "",
    priceUSD: 0,
  });
  const [editProduct, setEditProduct] = useState<NewProduct>({
    productName: "",
    priceUSD: 0,
  });

  const itemsPerPage = 5;

  // ─── Fetch products ───
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("API Error");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedRate = localStorage.getItem("exchangeRate");
    if (savedRate) {
      const rate = Number(savedRate);
      setExchangeRate(rate);
      setTempExchangeRate(rate);
    }
  }, []);

  // ─── Derived ───
  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatNumber = (num: number) =>
    Number(num || 0).toLocaleString("en-US");

  // ─── Add ───
  const handleAddProduct = async () => {
    if (!newProduct.productName.trim() || newProduct.priceUSD <= 0) {
      alert("يرجى إدخال اسم المنتج وسعر صحيح");
      return;
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, exchangeRate }),
      });
      if (res.ok) {
        await fetchProducts();
        setIsAddModalOpen(false);
        setNewProduct({ productName: "", priceUSD: 0 });
      } else {
        const err = await res.json();
        alert(err.error || "حدث خطأ في إضافة المنتج");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في إضافة المنتج");
    }
  };

  // ─── Edit ───
  const openEditModal = (p: Product) => {
    setSelectedProduct(p);
    setEditProduct({ productName: p.productName, priceUSD: p.priceUSD });
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    if (!editProduct.productName.trim() || editProduct.priceUSD <= 0) {
      alert("يرجى إدخال بيانات صحيحة");
      return;
    }
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editProduct, exchangeRate }),
      });
      if (res.ok) {
        await fetchProducts();
        setIsEditModalOpen(false);
        setSelectedProduct(null);
      } else {
        const err = await res.json();
        alert(err.error || "حدث خطأ في تعديل المنتج");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في تعديل المنتج");
    }
  };

  // ─── Delete ───
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchProducts();
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      } else {
        alert("حدث خطأ في حذف المنتج");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في حذف المنتج");
    }
  };

  // ─── Exchange rate ───
  const handleExchangeUpdate = async () => {
    if (tempExchangeRate <= 0) {
      alert("يرجى إدخال سعر صرف صحيح");
      return;
    }
    try {
      // Update all products in DB with new rate
      const res = await fetch("/api/products/update-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exchangeRate: tempExchangeRate }),
      });
      if (res.ok) {
        setExchangeRate(tempExchangeRate);
        localStorage.setItem("exchangeRate", String(tempExchangeRate));
        await fetchProducts();
        setShowExchangeModal(false);
      } else {
        alert("حدث خطأ في تحديث الأسعار");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في تحديث الأسعار");
    }
  };

  const openExchangeModal = () => {
    setTempExchangeRate(exchangeRate);
    setShowExchangeModal(true);
  };

  // ─── Loading ───
  if (loading) {
    return (
      <div className="p-6" dir="rtl">
        <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
        <p className="text-gray-600 mt-1">جاري التحميل...</p>
        <div className="animate-pulse mt-4 space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
      <p className="text-gray-600 mt-1 mb-6">إدارة المنتجات والأسعار</p>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            بحث بالمنتج:
          </label>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          {searchTerm && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              تم العثور على {filteredProducts.length} نتيجة
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={openExchangeModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <TrendingUp className="h-4 w-4" />
            <span>تعديل سعر الصرف</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {/* Exchange Rate Banner */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex justify-between items-center">
        <span className="text-sm text-gray-700">سعر صرف الدولار اليوم:</span>
        <span className="font-bold text-blue-700 text-lg">
          {formatNumber(exchangeRate)} ل.س
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600">
                  اسم المنتج
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600">
                  السعر (دولار)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600">
                  السعر (ليرة سورية)
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600">
                  تاريخ الإضافة
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600">
                  آخر تحديث
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        {product.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        {product.priceUSD}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatNumber(product.priceSYP)} ل.س
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString("ar-SY")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.updatedAt).toLocaleDateString("ar-SY")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm">
                      {searchTerm
                        ? `لا توجد منتجات مطابقة لـ "${searchTerm}"`
                        : "لا توجد منتجات"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              عرض {startIndex + 1} إلى{" "}
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)} من{" "}
              {filteredProducts.length} منتج
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronRight className="h-4 w-4" />
                السابق
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                التالي
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Modal: Add Product ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                إضافة منتج جديد
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productName: e.target.value,
                    })
                  }
                  placeholder="مثال: سكر، رز..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر بالدولار
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.priceUSD || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      priceUSD:
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value),
                    })
                  }
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calculator className="h-4 w-4" />
                  <span>السعر بالليرة السورية:</span>
                </div>
                <p className="text-lg font-bold text-blue-700 mt-1">
                  {formatNumber(newProduct.priceUSD * exchangeRate)} ل.س
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  (سعر الصرف الحالي: {formatNumber(exchangeRate)})
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Edit Product ─── */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">تعديل منتج</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  value={editProduct.productName}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      productName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر بالدولار
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editProduct.priceUSD || ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      priceUSD:
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calculator className="h-4 w-4" />
                  <span>السعر بالليرة السورية:</span>
                </div>
                <p className="text-lg font-bold text-blue-700 mt-1">
                  {formatNumber(editProduct.priceUSD * exchangeRate)} ل.س
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleEditProduct}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Delete Confirm ─── */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              تأكيد الحذف
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              هل أنت متأكد من حذف المنتج "{selectedProduct.productName}"؟ لا يمكن
              التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Exchange Rate ─── */}
      {showExchangeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                تعديل سعر الصرف
              </h2>
              <button
                onClick={() => setShowExchangeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  سعر صرف الدولار (ل.س)
                </label>
                <input
                  type="number"
                  min="1"
                  value={tempExchangeRate || ""}
                  onChange={(e) =>
                    setTempExchangeRate(
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-right text-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                <p className="font-medium mb-1">⚠️ ملاحظة:</p>
                <p>
                  سيتم تحديث أسعار جميع المنتجات بالليرة السورية بناءً على السعر
                  الجديد.
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">السعر الحالي:</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatNumber(exchangeRate)} ل.س
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowExchangeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleExchangeUpdate}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                تحديث
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
