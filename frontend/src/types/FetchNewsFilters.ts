export interface FetchNewsFilters {
    sources?: string[];
    categories?: string[];
    keywords?: string;
    page: number;
    date_range?: { start: Date, end: Date};

}