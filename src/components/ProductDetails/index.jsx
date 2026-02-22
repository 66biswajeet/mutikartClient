"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CategoryBar from "@/components/CategoryBar/CategoryBar";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import dynamic from "next/dynamic";
const ProductTabs = dynamic(() => import("./ProductTabs"), {
  ssr: false,
  loading: () => null,
});
const RelatedProducts = dynamic(() => import("./RelatedProducts"), {
  ssr: false,
  loading: () => null,
});

export default function ProductDetails({ productSlug }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/products?slug=${encodeURIComponent(productSlug)}`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        let item = null;
        if (data) {
          if (Array.isArray(data.data)) item = data.data[0];
          else if (data.data && typeof data.data === "object") item = data.data;
          else if (Array.isArray(data)) item = data[0];
          else if (data && data._id) item = data;
        }

        if (!item) throw new Error("Product not found");
        setProduct(item);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (productSlug) fetchProduct();
  }, [productSlug]);

  const handleQuantityChange = (newQ) => {
    if (newQ >= 1 && newQ <= (product?.quantity || 1)) setQuantity(newQ);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          {error || "The product you're looking for doesn't exist."}
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Prepare images
  const media = Array.isArray(product.media) ? product.media : [];
  const primary = media.find((m) => m.is_primary) || media[0] || null;
  const images = media.map((m) => (m && m.url) || m);
  if (primary) {
    const pUrl = (primary && primary.url) || primary;
    const filtered = images.filter((u) => u !== pUrl);
    images.unshift(pUrl);
  }

  return (
    <div>
      <CategoryBar />
      <div
        className="bg-gray-50 min-h-screen"
        style={{
          paddingTop: "calc(var(--header-height) + var(--category-bar-height))",
        }}
      >
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex text-sm text-gray-600">
              <a href="/" className="hover:text-blue-500">
                Home
              </a>
              <span className="mx-2">/</span>
              <a href="/products" className="hover:text-blue-500">
                Products
              </a>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.product_name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              <ProductGallery
                images={images}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                productName={product.product_name}
              />
              <ProductInfo
                product={product}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />
            </div>
          </div>

          <ProductTabs product={product} />
          <RelatedProducts currentProductId={product._id} />
        </div>
      </div>
    </div>
  );
}
