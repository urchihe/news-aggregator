import React from "react";
import NewsFilter from "../../features/news/components/NewsFilter";
import NewsList from "../../features/news/components/NewsList";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import Header from "../../components/Header";
import GuessLayout from "../../layouts/GuessLayout";
import { SearchLayout } from "../../layouts/SearchLayout";

const Homepage: React.FC = () => {
    return (
        <AuthenticatedLayout>
            <SearchLayout>
                <GuessLayout>
                    <Header />
                    <NewsFilter />
                    <NewsList />
                </GuessLayout>
            </SearchLayout>
        </AuthenticatedLayout>
    );
};
export default Homepage;
