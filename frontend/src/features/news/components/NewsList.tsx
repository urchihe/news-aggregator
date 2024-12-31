import React, { useState, useEffect } from 'react';
import { useFetchNewsQuery } from '../newsApi';
import { useSelector, useDispatch } from "react-redux";
import NewsItem from './NewsItem';
import {RootState} from "../../../app/store";

export default function NewsList() {
    const filters = useSelector((state: RootState) => state.news.filters);
    const keywords = useSelector((state: RootState) => state.news.searchQuery);
    const [page, setPage] = useState(1);
    const { data, error, isFetching, isLoading } = useFetchNewsQuery(
        { page, categories:filters.categories, sources:filters.sources, keywords, date_range:filters.date_range  });


    const loadMore = () => {
        if (data?.next_page_url) {
            setPage((prev) => prev + 1);
        }
    };

    if (isLoading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {(error as any).message}</div>;
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto">
                {data?.data && data?.data.map((article) => (
                    <NewsItem key={article.id} article={article} />
                ))}
            </div>

            <div className="flex justify-center mt-6">
                <button
                    className={`px-6 py-2 rounded-md text-white ${
                        data?.next_page_url
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={loadMore}
                    disabled={!data?.next_page_url || isFetching}
                >
                    {isFetching ? 'Loading more...' : data?.next_page_url ? 'Load More' : 'Nothing more to load'}
                </button>
            </div>

            {isFetching && (
                <div className="text-center text-gray-500 mt-2">Fetching...</div>
            )}
        </>
    );
}
