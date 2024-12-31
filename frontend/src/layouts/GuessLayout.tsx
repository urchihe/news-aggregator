import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { fetchArticles } from "../features/news/newsSlice";

interface GuessLayoutProps {
    children: React.ReactNode;
}

const GuessLayout: React.FC<GuessLayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.news.filters);
    const searchQuery = useSelector((state: RootState) => state.news.searchQuery);
    const prefs = useSelector((state: RootState) => state.auth.prefs);
    const { articles, status } = useSelector((state: RootState) => state.news);

    useEffect(() => {
        // Fetch articles when filters, searchQuery, or preferences change
        dispatch(
            fetchArticles({
                filters,
                searchQuery,
                categories: prefs.categories || [],
                sources: prefs.sources || [],
                keywords: prefs.keywords || [],
                pageParam: undefined,
            })
        );
    }, [dispatch, filters, searchQuery, prefs]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "failed") {
        return <div>Error loading articles</div>;
    }

    return (
        <div className="guess-layout">
            {children}
        </div>
    );
};

export default GuessLayout;
