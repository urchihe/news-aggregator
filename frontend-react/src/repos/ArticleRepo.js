import {axiosClient} from "../util/axios.js";

export default class ArticleRepository {
    static async getArticles(url = null, params = null) {
        return axiosClient.get(
            url ?? '/api/news',
            {
                params: params ?? {},
            }
        ).then(res => res.data);
    }

    static async getArticleFilterData() {
        return axiosClient.get('/api/filter-news').then(res => res.data);
    }
}
