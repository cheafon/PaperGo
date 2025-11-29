"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { search_papers } from "@/api/requests";

export default function Assistant() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await search_papers({ query });
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
                <h1>论文搜索</h1>

                {/* 搜索框 */}
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="输入研究想法或关键词..."
                        style={{ width: "500px", padding: "10px", fontSize: "16px" }}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        style={{ marginLeft: "10px", padding: "10px 20px", fontSize: "16px" }}
                    >
                        {loading ? "搜索中..." : "搜索"}
                    </button>
                </div>

                {/* 结果显示 */}
                {results && (
                    <div>
                        <h2>找到 {results.total} 篇论文</h2>
                        {results.data?.map((paper: any, index: number) => (
                            <div key={paper.paperId || index} style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                marginBottom: "10px",
                                borderRadius: "5px"
                            }}>
                                <h3>{paper.title}</h3>
                                <p>
                                    <strong>作者:</strong> {paper.authors?.map((a: any) => a.name).join(", ")}
                                </p>
                                <p>
                                    <strong>年份:</strong> {paper.year} |
                                    <strong> 引用数:</strong> {paper.citationCount} |
                                    <strong> 参考文献:</strong> {paper.referenceCount}
                                </p>
                                {paper.abstract && (
                                    <p><strong>摘要:</strong> {paper.abstract}</p>
                                )}
                                {paper.url && (
                                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                        查看详情
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}