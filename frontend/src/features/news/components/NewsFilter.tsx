import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Popover, Text, MultiSelect } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Filter } from "tabler-icons-react";
import { RootState } from "../../../app/store";
import { setSearchQuery } from "../newsSlice";
import { useFetchNewsQuery } from "../newsApi";
import { useGetCategoriesQuery } from "../../categories/categoriesApi";
import { useGetSourcesQuery } from "../../sources/sourcesApi";

const NewsFilter: React.FC = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.news.filters);
    const accentColor = useSelector((state: RootState) => state.news.accentColor);
    const [newCategories, setNewCategories] = useState<string[]>([]);
    const [sources, setSources] = useState<string[]>([]);
    const [date, setDate] = useState("");


    const { data, error, isLoading } = useFetchNewsQuery({ ...filters });

    const { data: categoriesOptions, error: categoriesError, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
    const { data: originOptions, error: sourceError, isLoading: isSourcesLoading } = useGetSourcesQuery();

    const filterCount = [
        filters.categories?.length > 0,
        filters.sources?.length > 0,
        filters.date_range?.[0] && filters.date_range?.[1],
    ].filter(Boolean).length;

    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (type: string, value: any) => {
        dispatch(setSearchQuery({ ...filters, [type]: value }));
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setNewCategories(selectedOptions);
    };

    const handleSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
        setSources(selectedOptions);
    };

    const renderFilterInputs = () => (
        <div className="text-left">
            <Text
                className={`font-bold text-lg mb-4 ${
                    accentColor ? `text-${accentColor}-500` : ""
                }`}
            >
                Filters
            </Text>
            <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto" onSubmit={handleFilterChange}>
                <h2 className="text-xl font-bold mb-4">Filter News</h2>

                {/* Category Multi-Select */}
                <div className="mb-4">
                    <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-2">
                        Categories
                    </label>
                    <select
                        id="categories"
                        multiple
                        value={newCategories}
                        onChange={handleCategoryChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >

                        {categoriesOptions.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sources Multi-Select */}
                <div className="mb-4">
                    <label htmlFor="sources" className="block text-sm font-medium text-gray-700 mb-2">
                        Sources
                    </label>
                    <select
                        id="sources"
                        multiple
                        value={sources}
                        onChange={handleSourceChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {originOptions.map((source) => (
                            <option key={source.id} value={source.id}>
                                {source.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Picker */}
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 focus:outline-none"
                    >
                        Apply Filters
                    </button>
                </div>
            </form>

        </div>
    );

    return (
        <div className="justify-between items-center px-4 py-4">
            <div className="flex justify-between items-center px-4 py-4">
                <Text className="text-lg font-medium">
                    {data?.total ?? "0"} articles found
                </Text>
            </div>
            <div className="relative flex justify-end">
                {/* Trigger Button */}
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`flex items-center px-4 py-2 text-sm font-medium border rounded-md ${
                        accentColor
                    } hover:bg-gray-100 border-gray-300`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    {filterCount > 0 ? `Filter (${filterCount})` : "Filter"}
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div
                        className="absolute right-0 mt-2 w-full max-w-xs sm:max-w-md p-4 bg-white border rounded-md shadow-md z-10"
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {isLoading ? (
                            <div className="text-center">Loading...</div>
                        ) : error ? (
                            <div className="text-red-500 text-sm">Error: {error}</div>
                        ) : (
                            renderFilterInputs()
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsFilter;
