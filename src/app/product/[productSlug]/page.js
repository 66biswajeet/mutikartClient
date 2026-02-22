import ProductDetails from "@/components/ProductDetails";

export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const { productSlug } = resolvedParams;
    const API_URL =
      process.env.NEXT_PUBLIC_ADMIN_API_URL || "http://localhost:3000";

    const response = await fetch(`${API_URL}/api/product?slug=${productSlug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour instead of no-store
    });

    if (!response.ok) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const data = await response.json();
    const product = data.data?.[0];

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    return {
      title: product.product_name || "Product Details",
      description: product.short_description || product.product_name,
      openGraph: {
        title: product.product_name,
        description: product.short_description,
        images: [
          {
            url: product.product_thumbnail_image || "/placeholder.jpg",
            width: 800,
            height: 600,
            alt: product.product_name,
          },
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Details",
      description: "View product details",
    };
  }
}

const ProductPage = async ({ params }) => {
  const resolved = await params;
  const productSlug = resolved?.productSlug;
  return <ProductDetails productSlug={productSlug} />;
};

export default ProductPage;
