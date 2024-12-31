import React, { useState, createContext, useContext, ReactNode } from "react";
import { useDebouncedValue } from "@mantine/hooks";

// Define the type for the context value
interface SearchLayoutContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    debouncedSearchQuery: string;
}

// Create the context with an initial value of null
const SearchLayoutContext = createContext<SearchLayoutContextType | null>(null);

// Hook to use the FeedSearchContext
export const useFeedSearch = () => {
    const context = useContext(SearchLayoutContext);
    if (!context) {
        throw new Error("useSearchLayout must be used within a SearchLayoutProvider");
    }
    return context;
};

// Define props for the FeedSearchProvider
interface SearchLayoutProviderProps {
    children: ReactNode;
}

// FeedSearchProvider component
export const SearchLayout: React.FC<SearchLayoutProviderProps> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500, { leading: true });

    return (
        <SearchLayoutContext.Provider
            value={{
                searchQuery,
                setSearchQuery,
                debouncedSearchQuery,
            }}
        >
            {children}
        </SearchLayoutContext.Provider>
    );
};
