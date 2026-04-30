// app/products/page.tsx
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
} from "lucide-react";

interface Product {
  id: string;
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
  const [exchangeRate, setExchangeRate] = useState(15000);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [tempExchangeRate, setTempExchangeRate] = useState(exchangeRate);
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedRate = localStorage.getItem("exchangeRate");
    if (savedRate) {
      setExchangeRate(parseFloat(savedRate));
      setTempExchangeRate(parseFloat(savedRate));
    }
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productName.includes(searchTerm),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleAddProduct = async () => {
    if (!newProduct.productName || newProduct.priceUSD <= 0) {
      alert("يرجى ملء جميع الحقول بشكل صحيح");
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, exchangeRate }),
      });

      if (response.ok) {
        await fetchProducts();
        setIsAddModalOpen(false);
        setNewProduct({ productName: "", priceUSD: 0 });
      } else {
        alert("حدث خطأ في إضافة المنتج");
      }
    } catch (error) {
      console.error("خطأ:", error);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditProduct({
      productName: product.productName,
      priceUSD: product.priceUSD,
    });
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async () => {
    if (!editProduct.productName || editProduct.priceUSD <= 0) {
      alert("يرجى ملء جميع الحقول بشكل صحيح");
      return;
    }

    try {
      const response = await fetch(`/api/products/${selectedProduct?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editProduct, exchangeRate }),
      });

      if (response.ok) {
        await fetchProducts();
        setIsEditModalOpen(false);
        setSelectedProduct(null);
      } else {
        alert("حدث خطأ في تعديل المنتج");
      }
    } catch (error) {
      console.error("خطأ:", error);
    }
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`/api/products/${selectedProduct?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProducts();
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      } else {
        alert("حدث خطأ في حذف المنتج");
      }
    } catch (error) {
      console.error("خطأ:", error);
    }
  };

  const openExchangeModal = () => {
    setTempExchangeRate(exchangeRate);
    setShowExchangeModal(true);
  };

  const handleExchangeUpdate = () => {
    if (tempExchangeRate > 0) {
      setExchangeRate(tempExchangeRate);
      localStorage.setItem("exchangeRate", tempExchangeRate.toString());
      setProducts(
        products.map((product) => ({
          ...product,
          priceSYP: product.priceUSD * tempExchangeRate,
        })),
      );
      setShowExchangeModal(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  if (loading) {
    return (
      <div className="p-6" dir="rtl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          المنتجات
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">جاري التحميل...</p>
        <div className="animate-pulse mt-4">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        المنتجات
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1 mb-6">
        إدارة المنتجات والأسعار
      </p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            بحث بالمنتج:
          </label>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          {searchTerm && (
            <span className="text-xs text-gray-500">
              تم العثور على {filteredProducts.length} نتيجة
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={openExchangeModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <TrendingUp className="h-4 w-4" />
            <span>تعديل سعر الصرف</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">سعر صرف الدولار اليوم:</span>
          <span className="font-bold text-blue-600">
            {formatNumber(exchangeRate)} ليرة سورية
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b">
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
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        {product.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-gray-400" />
                        {product.priceUSD}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatNumber(product.priceSYP)} ل.س
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.createdAt}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.updatedAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-1 text-red-600 hover:text-red-800"
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
                    <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p>لا توجد منتجات مطابقة لبحث "{searchTerm}"</p>
                    <button
                      onClick={clearSearch}
                      className="text-sm text-blue-600 mt-2"
                    >
                      مسح البحث
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
              عرض {startIndex + 1} إلى{" "}
              {Math.min(endIndex, filteredProducts.length)} من{" "}
              {filteredProducts.length} منتج
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-sm border disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4 inline" /> السابق
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-sm border disabled:opacity-50"
              >
                التالي <ChevronLeft className="h-4 w-4 inline" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">إضافة منتج جديد</h2>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={newProduct.productName}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productName: e.target.value })
                }
                placeholder="اسم المنتج"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                value={newProduct.priceUSD}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    priceUSD: parseFloat(e.target.value),
                  })
                }
                placeholder="السعر بالدولار"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500">
                السعر بالليرة:{" "}
                {formatNumber(newProduct.priceUSD * exchangeRate)} ل.س
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Product */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">تعديل منتج</h2>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={editProduct.productName}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    productName: e.target.value,
                  })
                }
                placeholder="اسم المنتج"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                value={editProduct.priceUSD}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    priceUSD: parseFloat(e.target.value),
                  })
                }
                placeholder="السعر بالدولار"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500">
                السعر بالليرة:{" "}
                {formatNumber(editProduct.priceUSD * exchangeRate)} ل.س
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleEditProduct}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {isDeleteModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-2xl font-bold mb-4">تأكيد الحذف</h2>
            <p className="mb-6">
              هل تريد حذف المنتج "{selectedProduct.productName}"؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exchange Rate */}
      {showExchangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <h2 className="text-2xl font-bold mb-4">تعديل سعر الصرف</h2>
            <input
              type="number"
              value={tempExchangeRate}
              onChange={(e) => setTempExchangeRate(parseFloat(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg mb-4"
            />
            <p className="text-xs text-gray-500 mb-6">
              مثال: 15000 يعني 1 دولار = 15000 ليرة
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExchangeModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
              >
                إلغاء
              </button>
              <button
                onClick={handleExchangeUpdate}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg"
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
