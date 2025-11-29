// 请求文章detail
export async function fetch_paper_detail(){
    const response = await fetch(
        "https://api.semanticscholar.org/graph/v1/paper/649def34f8be52c8b66281af98ae884c09aef38b?" +
        "fields=url,title,year,authors,venue,references,citations," +
        "citations.citationCount,citations.referenceCount,citations.title,citations.year," +
        "references.citationCount,references.referenceCount,references.title,references.year," +
        "referenceCount,citationCount",
        {
            headers: {
                "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY || ""
            }
        }
    );
    const data = await response.json();
    return Response.json(data);
}

// 搜索参数接口
interface PaperSearchParams {
    query: string;                    // 搜索关键词（必填）
    fields?: string;                  // 返回的字段，逗号分隔
    limit?: number;                   // 返回结果数量，最大100，默认100
    offset?: number;                  // 分页偏移量
    year?: string;                    // 年份过滤，如 "2020" 或 "2018-2020"
    venue?: string[];                 // 会议/期刊过滤
    fieldsOfStudy?: string[];         // 研究领域过滤
    minCitationCount?: number;        // 最小引用数过滤
}

// 批量搜索参数接口
interface PaperBulkSearchParams {
    query: string;                    // 支持布尔逻辑的搜索查询
    token?: string;                   // 分页token
    sort?: 'paperId' | 'publicationDate' | 'citationCount';  // 排序方式
    fields?: string;                  // 返回的字段
    year?: string;                    // 年份过滤
    venue?: string[];                 // 会议/期刊过滤
    fieldsOfStudy?: string[];         // 研究领域过滤
    minCitationCount?: number;        // 最小引用数过滤
}

// 根据关键字进行相关文章搜索（相关性排序）
export async function search_papers(params: PaperSearchParams) {
    const {
        query,
        fields = "paperId,title,abstract,year,authors,venue,citationCount,referenceCount,fieldsOfStudy,url,openAccessPdf",
        limit = 20,
        offset = 0,
        year,
        venue,
        fieldsOfStudy,
        minCitationCount
    } = params;

    // 构建查询参数
    const searchParams = new URLSearchParams({
        query,
        fields,
        limit: limit.toString(),
        offset: offset.toString()
    });

    // 添加可选过滤参数
    if (year) searchParams.append('year', year);
    if (venue) venue.forEach(v => searchParams.append('venue', v));
    if (fieldsOfStudy) fieldsOfStudy.forEach(f => searchParams.append('fieldsOfStudy', f));
    if (minCitationCount) searchParams.append('minCitationCount', minCitationCount.toString());

    const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search?${searchParams.toString()}`,
        {
            headers: {
                "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY || ""
            }
        }
    );

    const data = await response.json();
    return Response.json(data);
}

// 批量搜索（支持布尔逻辑和排序）
export async function search_papers_bulk(params: PaperBulkSearchParams) {
    const {
        query,
        token,
        sort,
        fields = "paperId,title,abstract,year,authors,venue,citationCount,referenceCount,fieldsOfStudy,url,openAccessPdf",
        year,
        venue,
        fieldsOfStudy,
        minCitationCount
    } = params;

    // 构建查询参数
    const searchParams = new URLSearchParams({
        query,
        fields
    });

    // 添加可选参数
    if (token) searchParams.append('token', token);
    if (sort) searchParams.append('sort', sort);
    if (year) searchParams.append('year', year);
    if (venue) venue.forEach(v => searchParams.append('venue', v));
    if (fieldsOfStudy) fieldsOfStudy.forEach(f => searchParams.append('fieldsOfStudy', f));
    if (minCitationCount) searchParams.append('minCitationCount', minCitationCount.toString());

    const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search/bulk?${searchParams.toString()}`,
        {
            headers: {
                "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY || ""
            }
        }
    );

    const data = await response.json();
    return Response.json(data);
}

// 根据标题精确匹配搜索
export async function search_paper_by_title(title: string, fields?: string) {
    const searchParams = new URLSearchParams({
        query: title,
        fields: fields || "paperId,title,abstract,year,authors,venue,citationCount,matchScore"
    });

    const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/search/match?${searchParams.toString()}`,
        {
            headers: {
                "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY || ""
            }
        }
    );

    const data = await response.json();
    return Response.json(data);
}

// 论文自动补全（用于搜索建议）
export async function autocomplete_papers(query: string) {
    const searchParams = new URLSearchParams({
        query: query.slice(0, 100) // API限制最多100个字符
    });

    const response = await fetch(
        `https://api.semanticscholar.org/graph/v1/paper/autocomplete?${searchParams.toString()}`,
        {
            headers: {
                "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY || ""
            }
        }
    );

    const data = await response.json();
    return Response.json(data);
}