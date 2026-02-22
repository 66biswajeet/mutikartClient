"use client";

import { useState } from "react";

export default function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description" },
    { id: "reviews", label: `Reviews (${product.reviews_count || 0})` },
    { id: "specifications", label: "Specifications" },
  ];

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="prose max-w-none">
            {product.description ? (
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : product.short_description ? (
              <p className="text-gray-700">{product.short_description}</p>
            ) : (
              <p className="text-gray-500 italic">
                No description available for this product.
              </p>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            {product.reviews_count > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-4xl font-bold">
                        {product.rating?.toFixed(1) || "0.0"}
                      </span>
                      <div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <svg
                              key={index}
                              className={`w-5 h-5 ${
                                index < Math.floor(product.rating || 0)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Based on {product.reviews_count} reviews
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                    Write a Review
                  </button>
                </div>

                <div className="border-t pt-6">
                  <p className="text-gray-600 text-center py-8">
                    Review details will be loaded here from the API
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No reviews yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Be the first to review this product
                </p>
                <div className="mt-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div>
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                {product.sku && (
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-900 w-1/3">
                      SKU
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {product.sku}
                    </td>
                  </tr>
                )}
                {product.brand_id?.name && (
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-900 w-1/3">
                      Brand
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {product.brand_id.name}
                    </td>
                  </tr>
                )}
                {product.category_id?.name && (
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-900 w-1/3">
                      Category
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {product.category_id.name}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-3 text-sm font-medium text-gray-900 w-1/3">
                    Availability
                  </td>
                  <td className="py-3 text-sm text-gray-700">
                    {product.stock_status === "out_of_stock" ||
                    product.quantity < 1 ? (
                      <span className="text-red-600">Out of Stock</span>
                    ) : (
                      <span className="text-green-600">
                        In Stock ({product.quantity} available)
                      </span>
                    )}
                  </td>
                </tr>
                {product.weight && (
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-900 w-1/3">
                      Weight
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {product.weight}
                    </td>
                  </tr>
                )}
                {product.dimensions && (
                  <tr>
                    <td className="py-3 text-sm font-medium text-gray-900 w-1/3">
                      Dimensions
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {product.dimensions}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {!product.sku &&
              !product.brand_id &&
              !product.category_id &&
              !product.weight &&
              !product.dimensions && (
                <p className="text-gray-500 text-center py-8">
                  No specifications available for this product.
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
