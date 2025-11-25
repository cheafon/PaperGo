
// 请求文章detail
export async function fetch_paper_detail(){
    const response = await fetch("https://api.semanticscholar.org/graph/v1/paper/649def34f8be52c8b66281af98ae884c09aef38b?" +
        "fields=url,title,year,authors,venue,references,citations," +
        "citations.citationCount,citations.referenceCount,citations.title,citations.year," +
        "references.citationCount,references.referenceCount,references.title,references.year,"+
        "referenceCount,citationCount")
    const data = await response.json();
    return Response.json(data);
}