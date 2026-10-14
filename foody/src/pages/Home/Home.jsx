import React, { useState } from "react";
import HeroCarousel from "../../components/HeroCarousel/HeroCarousel";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownlod from "../../components/AppDownlod/AppDownlod";
import FilterSort from "../../components/FilterSort/FilterSort";
import SearchBar from "../../components/SearchBar/SearchBar";
import FoodDetailsModal from "../../components/FoodDetailsModal/FoodDetailsModal";
import OffersSection from "../../components/OffersSection/OffersSection";
import "./Home.css";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    price: "all",
    rating: "all",
    veg: false,
  });
  const [sortBy, setSortBy] = useState("popularity");
  const [counts, setCounts] = useState({ total: 0, filtered: 0 });
  const [selectedFood, setSelectedFood] = useState(null);

  return (
    <div className="home">
      <HeroCarousel />

      {/* ✅ SearchBar — khud sticky hai */}
      <SearchBar
        onSearchChange={setSearchQuery}
        onSelectFood={setSelectedFood}
      />

      <ExploreMenu category={category} setCategory={setCategory} />

      <FilterSort
        onFilterChange={setFilters}
        onSortChange={setSortBy}
        totalCount={counts.total}
        filteredCount={counts.filtered}
      />

      <FoodDisplay
        category={category}
        searchQuery={searchQuery}
        filters={filters}
        sortBy={sortBy}
        onCountsChange={setCounts}
        onSelectFood={setSelectedFood}
      />

      <OffersSection />

      <AppDownlod />

      {selectedFood && (
        <FoodDetailsModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
};

export default Home;




