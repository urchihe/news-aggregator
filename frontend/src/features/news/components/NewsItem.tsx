import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { stripHtml } from "../../../utils/string";

dayjs.extend(relativeTime);

interface NewsItemProps {
    article: {
        web_url: string;
        image_url: string;
        title: string;
        description: string;
        category: string;
        published_at: string;
        origin: string;
    };
}

const NewsItem: React.FC<NewsItemProps> = ({ article }) => {
    const searchQuery = useSelector((state: RootState) => state.news.searchQuery.trim());
    const accentColor = useSelector((state: RootState) => state.news.accentColor);

    const highlightText = (text: string): React.ReactNode => {
        if (!searchQuery) return text;

        const fragments = text.split(new RegExp(`(${searchQuery})`, "i"));
        return fragments.map((fragment, index) => (
            <span key={index} style={fragment.toLowerCase() === searchQuery.toLowerCase() ? { backgroundColor: accentColor } : undefined}>
        {fragment}
      </span>
        ));
    };

    return (
        <div className="flex flex-col gap-2 rounded-lg p-4 mb-4 bg-white shadow-md">
            <a href={article.web_url} target="_blank" rel="noopener noreferrer">
                <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full rounded-lg object-cover aspect-video"
                />
            </a>

            <div>
                <div className="pb-2 text-sm text-gray-600">
                    {article.category.name} · {dayjs(article.published_at).fromNow()}
                </div>

                <a
                    href={article.web_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="line-clamp-3 text-lg font-bold text-black"
                >
                    {highlightText(article.title)}
                </a>

                <p className="pt-2 text-sm text-gray-700 line-clamp-5">
                    {highlightText(stripHtml(article.description))}
                </p>

                <p className="pt-2 text-sm text-gray-600 line-clamp-1" style={{ color: accentColor }}>
                    {article.source.name}
                </p>
            </div>
        </div>
    );
};

export default NewsItem;
