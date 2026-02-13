import React, { useState, useMemo, useEffect } from "react";
import { Star, ChevronDown, Filter, MapPin, Calendar, X, SearchX } from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";
import Navbar from "@/Components/Frontend/Navbar";
import { Link, router, usePage, Head } from "@inertiajs/react";

const BrowseTools = ({
    tools,
    staticCategories,
    filters = {},
    maxDatabasePrice,
}) => {
    // State Initialization
    const [priceRange, setPriceRange] = useState(
        filters?.max_price || maxDatabasePrice
    );
    const [selectedCategories, setSelectedCategories] = useState(
        filters?.categories ? filters.categories.split(",") : []
    );
    const [sortOpen, setSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(
        filters?.sort || "recommended"
    );
    const [deliveryType, setDeliveryType] = useState(
        filters?.delivery_type || "any"
    );
    const [availableDate, setAvailableDate] = useState(
        filters?.available_date || ""
    );

    const { url } = usePage();

    const sortOptions = [
        { value: "recommended", label: "Recommended" },
        { value: "price_low", label: "Price: Low to High" },
        { value: "price_high", label: "Price: High to Low" },
        { value: "rating", label: "Rating: High to Low" },
        { value: "distance", label: "Distance: Nearest First" },
    ];

    const deliveryOptions = [
        { value: "any", label: "Any" },
        { value: "delivery_only", label: "Delivery Only" },
        { value: "pickup_only", label: "Pickup Only" },
    ];

    const applyFilters = (newFilters) => {
        router.get(
            url.split("?")[0],
            { ...filters, ...newFilters, page: 1 },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleCategoryToggle = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];

        setSelectedCategories(newCategories);
        applyFilters({
            categories: newCategories.length ? newCategories.join(",") : null,
        });
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
        applyFilters({ max_price: value });
    };

    const handleSortSelect = (value) => {
        setSelectedSort(value);
        setSortOpen(false);
        applyFilters({ sort: value });
    };

    const handleDeliveryChange = (e) => {
        const value = e.target.value;
        setDeliveryType(value);
        applyFilters({ delivery_type: value !== "any" ? value : null });
    };

    const handleDateChange = (e) => {
        const value = e.target.value;
        setAvailableDate(value);
        applyFilters({ available_date: value || null });
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setPriceRange(maxDatabasePrice);
        setSelectedSort("recommended");
        setDeliveryType("any");
        setAvailableDate("");
        router.get(
            url.split("?")[0],
            {},
            { preserveState: true, preserveScroll: true }
        );
    };

    const getToolRating = (tool) => {
        if (tool.reviews_avg_rating)
            return parseFloat(tool.reviews_avg_rating).toFixed(1);
        return tool.rating || 4.2;
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <GuestLayout>
            <Head title="Browse Tools | Rent Your Tools Online" />
            <Navbar />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 pt-28 md:pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-light text-gray-900 dark:text-white">
                                    Premium Tools Collection
                                </h1>
                                <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1 md:mt-2">
                                    {tools?.total || 0} tools available in your area
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    <Filter size={16} /> Filters
                                </button>

                                <div className="relative flex-1 md:flex-initial">
                                    <button
                                        onClick={() => setSortOpen(!sortOpen)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        Sort By{" "}
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform ${
                                                sortOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    {sortOpen && (
                                        <div className="absolute right-0 mt-2 w-full md:w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl z-[60] py-2 overflow-hidden">
                                            {sortOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() =>
                                                        handleSortSelect(opt.value)
                                                    }
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                        selectedSort === opt.value
                                                            ? "bg-emerald-50 dark:bg-emerald-900/20 font-bold text-emerald-700 dark:text-emerald-400"
                                                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {Object.keys(filters).length > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs md:text-sm text-red-600 dark:text-red-400 hover:underline mb-4 flex items-center gap-1 font-medium"
                            >
                                <X size={14} /> Clear All Filters
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters (Mobile Drawer & Desktop Sidebar) - Fixed positioning */}
                        <div className="lg:w-1/4">
                            {/* Mobile Drawer */}
                            <div 
                                className={`fixed inset-0 z-[110] lg:hidden transition-all duration-300 ${
                                    isFilterOpen ? "visible" : "invisible"
                                }`}
                            >
                                {/* Backdrop */}
                                <div 
                                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                                        isFilterOpen ? "opacity-100" : "opacity-0"
                                    }`}
                                    onClick={() => setIsFilterOpen(false)}
                                />
                                
                                {/* Drawer Content */}
                                <aside 
                                    className={`absolute left-0 top-0 h-full w-4/5 md:w-1/2 bg-white dark:bg-gray-950 p-6 overflow-y-auto transition-transform duration-300 shadow-2xl ${
                                        isFilterOpen ? "translate-x-0" : "-translate-x-full"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-bold dark:text-white">Filters</h2>
                                        <button onClick={() => setIsFilterOpen(false)} className="p-2 dark:text-white">
                                            <X size={24} />
                                        </button>
                                    </div>
                                    
                                    {/* Mobile Filter Content */}
                                    <div className="space-y-8">
                                        {/* Price Range */}
                                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                Price Range
                                            </h3>
                                            <div className="space-y-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={maxDatabasePrice}
                                                    value={priceRange}
                                                    onChange={(e) =>
                                                        handlePriceChange(e.target.value)
                                                    }
                                                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#10513D] dark:accent-emerald-500"
                                                />
                                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                                    <span>$0</span>
                                                    <span className="font-bold text-gray-900 dark:text-emerald-400">
                                                        ${priceRange}
                                                    </span>
                                                    <span>${maxDatabasePrice}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Categories */}
                                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                            <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                Categories
                                            </h3>
                                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                {staticCategories.map((cat, i) => (
                                                    <label
                                                        key={i}
                                                        className="flex items-center justify-between cursor-pointer group"
                                                    >
                                                        <span className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-emerald-600 transition-colors">
                                                            {cat}
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCategories.includes(
                                                                cat
                                                            )}
                                                            onChange={() =>
                                                                handleCategoryToggle(cat)
                                                            }
                                                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-[#10513D] dark:bg-gray-800 focus:ring-0"
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Other Filters */}
                                        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2">
                                                    Delivery Type
                                                </label>
                                                <select
                                                    value={deliveryType}
                                                    onChange={handleDeliveryChange}
                                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm focus:ring-[#10513D]"
                                                >
                                                    {deliveryOptions.map((opt) => (
                                                        <option
                                                            key={opt.value}
                                                            value={opt.value}
                                                        >
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2">
                                                    Availability Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={availableDate}
                                                    onChange={handleDateChange}
                                                    min={
                                                        new Date()
                                                            .toISOString()
                                                            .split("T")[0]
                                                    }
                                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm focus:ring-[#10513D]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>

                            {/* Desktop Sidebar - Always visible on large screens */}
                            <aside className="hidden lg:block space-y-8">
                                {/* Price Range */}
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                        Price Range
                                    </h3>
                                    <div className="space-y-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max={maxDatabasePrice}
                                            value={priceRange}
                                            onChange={(e) =>
                                                handlePriceChange(e.target.value)
                                            }
                                            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#10513D] dark:accent-emerald-500"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>$0</span>
                                            <span className="font-bold text-gray-900 dark:text-emerald-400">
                                                ${priceRange}
                                            </span>
                                            <span>${maxDatabasePrice}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                        Categories
                                    </h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                        {staticCategories.map((cat, i) => (
                                            <label
                                                key={i}
                                                className="flex items-center justify-between cursor-pointer group"
                                            >
                                                <span className="text-gray-700 dark:text-gray-300 text-sm group-hover:text-emerald-600 transition-colors">
                                                    {cat}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(
                                                        cat
                                                    )}
                                                    onChange={() =>
                                                        handleCategoryToggle(cat)
                                                    }
                                                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-[#10513D] dark:bg-gray-800 focus:ring-0"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Other Filters */}
                                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2">
                                            Delivery Type
                                        </label>
                                        <select
                                            value={deliveryType}
                                            onChange={handleDeliveryChange}
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm focus:ring-[#10513D]"
                                        >
                                            {deliveryOptions.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2">
                                            Availability Date
                                        </label>
                                        <input
                                            type="date"
                                            value={availableDate}
                                            onChange={handleDateChange}
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-lg text-sm focus:ring-[#10513D]"
                                        />
                                    </div>
                                </div>
                            </aside>
                        </div>

                        {/* Tools Grid - Fixed width */}
                        <main className="lg:w-3/4">
                            <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                                Showing{" "}
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {tools.from || 0}
                                </span>{" "}
                                to{" "}
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {tools.to || 0}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {tools.total}
                                </span>{" "}
                                tools
                            </div>

                            {tools.data.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tools.data.map((tool) => (
                                        <Link
                                            key={tool.id}
                                            href={route("browse-tools.details", tool.slug || tool.id)}
                                            className="bg-white dark:bg-gray-900 rounded-[24px] border border-gray-100 dark:border-gray-800 p-2.5 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all duration-300 group flex flex-col h-full"
                                        >
                                            <div className="relative h-40 rounded-[20px] overflow-hidden">
                                                <img
                                                    src={
                                                        tool.first_image_url ||
                                                        "https://images.unsplash.com/photo-1513467655676-561b7d489a88?q=80&w=500&auto=format&fit=crop"
                                                    }
                                                    alt={tool.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {(parseFloat(
                                                    tool.price_per_day
                                                ) > 70 ||
                                                    tool.featured) && (
                                                    <div className="absolute top-2 right-2 bg-[#3D7A54] dark:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg">
                                                        🏅 Top Rated
                                                    </div>
                                                )}
                                            </div>

                                            <div className="px-2.5 py-3 flex flex-col flex-grow">
                                                <h3 className="text-[16px] font-bold text-[#10513D] dark:text-emerald-400 mb-1 truncate leading-tight">
                                                    {tool.name}
                                                </h3>

                                                <div className="flex items-center gap-1 mb-2">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map(
                                                            (_, i) => {
                                                                const rating =
                                                                    getToolRating(
                                                                        tool
                                                                    );
                                                                return (
                                                                    <Star
                                                                        key={i}
                                                                        size={
                                                                            12
                                                                        }
                                                                        fill={
                                                                            i <
                                                                            Math.floor(
                                                                                rating
                                                                            )
                                                                                ? "#FACC15"
                                                                                : "none"
                                                                        }
                                                                        className={
                                                                            i <
                                                                            Math.floor(
                                                                                rating
                                                                            )
                                                                                ? "text-yellow-400"
                                                                                : "text-gray-300 dark:text-gray-600"
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                    <span className="text-gray-400 dark:text-gray-500 text-[11px] ml-1">
                                                        ({tool.reviews_count ||
                                                            16})
                                                    </span>
                                                </div>

                                                <p className="text-gray-400 dark:text-gray-500 text-[12px] mb-3 font-medium truncate flex items-center">
                                                    <MapPin
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    {tool.location_address ||
                                                        "Jersey City, NJ"}
                                                </p>

                                                <div className="flex flex-wrap items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto gap-2">
                                                    <div className="flex items-baseline gap-1 whitespace-nowrap">
                                                        <span className="text-[16px] font-extrabold text-[#10513D] dark:text-white">
                                                            $
                                                            {parseFloat(
                                                                tool.price_per_day
                                                            ).toFixed(2)}
                                                        </span>
                                                        <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                                            / Day
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="bg-[#3D7A54] dark:bg-emerald-600 hover:bg-[#10513D] dark:hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 transition-all active:scale-95 shadow-md"
                                                    >
                                                        Rent Now
                                                        <span>→</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white dark:bg-gray-900 rounded-[35px] border border-dashed border-gray-200 dark:border-gray-800 w-full h-auto min-h-[400px]">
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-full mb-6">
                                        <SearchX 
                                            size={48} 
                                            className="text-[#10513D] dark:text-emerald-400 opacity-60" 
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        No tools found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
                                        We couldn't find any tools matching your current filters. 
                                        Try adjusting your search criteria or looking for something else.
                                    </p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="bg-[#10513D] dark:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-[#0c3e2e] dark:hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <X size={18} />
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default BrowseTools;
