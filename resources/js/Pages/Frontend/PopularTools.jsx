import { Link } from "@inertiajs/react";
import { Star } from "lucide-react";

export default function PopularTools({ tools }) {
    // Array check
    const toolsList = Array.isArray(tools) ? tools : [];

    if (toolsList.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
                No tools found.
            </div>
        );
    }

    return (
        <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-[32px] md:text-[40px] font-bold text-center text-[#10513D] dark:text-emerald-400 mb-12">
                    Popular Tools Near You
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {toolsList.map((tool) => (
                        <div
                            key={tool.id}
                            className="bg-white dark:bg-gray-900 rounded-[35px] border border-gray-100 dark:border-gray-800 p-3 shadow-sm hover:shadow-xl dark:hover:shadow-emerald-900/10 transition-all duration-300 group"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 rounded-[28px] overflow-hidden">
                                <img
                                    src={tool.first_image_url}
                                    alt={tool.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {parseFloat(tool.price_per_day) > 70 && (
                                    <div className="absolute top-3 right-3 bg-[#3D7A54] dark:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                        🏅 Top Rated
                                    </div>
                                )}
                            </div>

                            <div className="px-3 py-5">
                                {/* Title */}
                                <h3 className="text-[20px] font-bold text-[#10513D] dark:text-emerald-400 mb-2 truncate">
                                    {tool.name}
                                </h3>

                                {/* Rating Section */}
                                <div className="flex items-center gap-1 mb-1">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={
                                                    i < 4 ? "#FACC15" : "none"
                                                }
                                                className={
                                                    i < 4
                                                        ? "text-yellow-400"
                                                        : "text-gray-300 dark:text-gray-600"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-400 dark:text-gray-500 text-[14px] ml-1 font-medium">
                                        (16)
                                    </span>
                                </div>

                                {/* Location */}
                                <p className="text-gray-400 dark:text-gray-500 text-[14px] mb-6 font-medium truncate">
                                    {tool.location_address || "Jersey City, NJ"}
                                </p>

                                {/* Footer: Price and Button */}
                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-5">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[15px] font-extrabold text-[#10513D] dark:text-white">
                                            ${tool.price_per_day}
                                        </span>
                                        <span className="text-[#10513D] dark:text-gray-400 text-[14px] font-bold">
                                            / Day
                                        </span>
                                    </div>

                                    <Link
                                        href={`/browse-tools/details/${tool.slug}`}
                                        className="bg-[#3D7A54] dark:bg-emerald-600 hover:bg-[#10513D] dark:hover:bg-emerald-700 text-white text-[13px] font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-md"
                                    >
                                        Rent Now
                                        <span className="text-[16px]">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
