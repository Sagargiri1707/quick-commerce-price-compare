import React, { useState } from "react";
import { ShoppingBasket, MapPin } from "lucide-react";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import LocationPrompt from "./components/LocationPrompt";
import { useLocation } from "./hooks/useLocation";
import { Product } from "./types";
import { searchProducts } from "./services/api";
import styled from "styled-components";

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    justify-items: center;
    max-width: 350px;
    margin: 0 auto;
  }
`;
function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useLocation();
  const handleSearch = async (query: string) => {
    if (!location) return;

    setLoading(true);
    const results = await searchProducts(query, location);
    setProducts(results);
    setLoading(false);
  };

  const handleRetryLocation = () => {
    window.location.reload();
  };

  const handleLocationReset = () => {
    localStorage.removeItem("lat");
    localStorage.removeItem("lon");
    window.location.reload();
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (locationError) {
    return (
      <LocationPrompt error={locationError} onRetry={handleRetryLocation} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBasket className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900">PriceWise</h1>
            </div>
            <button
              onClick={handleLocationReset}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Refetch Location
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Compare prices across quick commerce platforms
          </h2>
          <SearchBar onSearch={handleSearch} />
        </div>
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        {!loading && products.length > 0 && (
          <ProductGrid>
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </ProductGrid>
        )}
        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Search for products to see price comparisons
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
