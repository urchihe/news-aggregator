import React, { useRef, useState } from "react";
import { ActionIcon, TextInput, Text } from "@mantine/core";
import { Search, X } from "tabler-icons-react";
import UserMenu from "./UserPanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { setSearchQuery } from "../features/news/newsSlice";;

const Header: React.FC = () => {
    const [inSearchMode, setInSearchMode] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const dispatch: AppDispatch = useDispatch();
    const searchQuery = useSelector((state: RootState) => state.news.searchQuery);
    const accentColor = useSelector((state: RootState) => state.news.accentColor);

    const clearSearch = () => {
        dispatch(setSearchQuery(""));
        searchInputRef.current?.focus();
    };

    return (
        <>
            {inSearchMode ? (
                <TextInput
                    ref={searchInputRef}
                    value={searchQuery}
                    placeholder="Search news..."
                    onChange={(e) => dispatch(setSearchQuery(e.currentTarget.value))}
                    icon={<Search size={16} />} // Left icon
                    rightSection={
                        searchQuery && (
                            <ActionIcon onClick={clearSearch}>
                                <X size={16} />
                            </ActionIcon>
                        )
                    }
                    styles={{
                        input: {
                            borderRadius: "9999px", // Make it oval
                            paddingRight: "2.5rem", // Ensure space for the close button
                        },
                    }}
                />

            ) : (
                <div className="flex items-center justify-between px-4 py-3">
                    <Text
                        className={`text-2xl font-bold ${
                            accentColor ? `text-${accentColor}-500` : ""
                        }`}
                    >
                        News Feed
                    </Text>

                    <div className="flex items-center gap-4">
                        <ActionIcon
                            size="lg"
                            onClick={() => {
                                setInSearchMode(true);
                                setTimeout(() => searchInputRef.current?.focus(), 100);
                            }}
                        >
                            <Search size={40} strokeWidth={2} />
                        </ActionIcon>
                        <UserMenu />
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
