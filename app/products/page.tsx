"use client";

export const dynamic = "force-dynamic";

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
  const [tempExchangeRate, setTempExchangeRate] = useState(15000);
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // ✅ Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "API Error");
      }

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

  // ✅ Filter
  const filteredProducts = products.filter((p) =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ✅ Helpers
  const formatNumber = (num: number) =>
    Number(num || 0).toLocaleString("en-US");

  // ================= ADD =================
  const handleAddProduct = async () => {
    if (!newProduct.productName || newProduct.priceUSD <= 0) return;

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
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const openEditModal = (p: Product) => {
    setSelectedProduct(p);
    setEditProduct({
      productName: p.productName,
      priceUSD: p.priceUSD,
    });
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editProduct, exchangeRate }),
      });

      if (res.ok) {
        await fetchProducts();
        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchProducts();
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= EXCHANGE =================
  const handleExchangeUpdate = () => {
    if (tempExchangeRate > 0) {
      setExchangeRate(tempExchangeRate);
      localStorage.setItem("exchangeRate", String(tempExchangeRate));
      setShowExchangeModal(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">جاري التحميل...</h1>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">المنتجات</h1>

      {/* SEARCH */}
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="بحث..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="border rounded">
        {currentProducts.map((p) => (
          <div key={p.id} className="flex justify-between p-2 border-b">
            <span>{p.productName}</span>
            <span>{p.priceUSD}$</span>

            <div className="flex gap-2">
              <button onClick={() => openEditModal(p)}>تعديل</button>
              <button
                onClick={() => {
                  setSelectedProduct(p);
                  setIsDeleteModalOpen(true);
                }}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          السابق
        </button>

        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage >= totalPages}
        >
          التالي
        </button>
      </div>

      {/* ADD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <input
              placeholder="اسم المنتج"
              value={newProduct.productName}
              onChange={(e) =>
                setNewProduct({ ...newProduct, productName: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="السعر"
              value={newProduct.priceUSD}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  priceUSD: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />

            <button onClick={handleAddProduct}>إضافة</button>
          </div>
        </div>
      )}

      {/* EDIT */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-96">
            <input
              value={editProduct.productName}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  productName: e.target.value,
                })
              }
            />

            <input
              type="number"
              value={editProduct.priceUSD}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  priceUSD: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />

            <button onClick={handleEditProduct}>حفظ</button>
          </div>
        </div>
      )}

      {/* DELETE */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <p>هل تريد الحذف؟</p>
            <button onClick={handleDeleteProduct}>نعم</button>
          </div>
        </div>
      )}
    </div>
  );
}