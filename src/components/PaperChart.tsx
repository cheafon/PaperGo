"use client";

import React, {useEffect, useState} from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {fetch_paper_detail} from "@/api/requests";

export interface Author {
    authorId?: string;
    name: string;
}

export interface Reference {
    paperId: string;
    title: string;
    citationCount?: number;
    year?: number;
    authors?: Author[];
}

export interface PaperData {
    paperId: string;
    title: string;
    authors: Author[];
    year: number;
    venue?: string;
    citationCount: number;
    referenceCount: number;
    abstract?: string;
    citations?: Reference[];
    references?: Reference[];
}

interface PaperChartProps {
    data: PaperData;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function PaperChart() {
    const [data,setData] = useState<PaperData>(null);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await fetch_paper_detail();
                const res_data = await response.json() as PaperData
                console.log("数据",res_data)
                setData(res_data)
            } catch (e) {
                console.log("获取数据失败：",e)
            } finally {
                setLoading(false)
            }

        }
        fetchData()
    },[])
    if(loading){
        return <div>加载中。。。</div>
    }
    if(!data){
        return <div>semantic scholar接口繁忙,刷新重试</div>
    }

    // Prepare data for citation vs reference comparison
    const comparisonData = [
        {
            name: "Citations",
            count: data.citationCount,
            fill: "#0088FE",
        },
        {
            name: "References",
            count: data.referenceCount,
            fill: "#00C49F",
        },
    ];

    // Prepare pie chart data
    const pieData = [
        {name: "Citations", value: data.citationCount},
        {name: "References", value: data.referenceCount},
    ];

    // Get top 5 citations and references
    const topCitations = data.citations
        ?.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
        .slice(0, 5) || [];

    const topReferences = data.references
        ?.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0))
        .slice(0, 5) || [];

    return (
        <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Paper Information
                </h2>
                <div className="space-y-3">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700">
                            {data.title}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-600">Authors:</span>
                            <p className="text-gray-800">
                                {data.authors.map((a) => a.name).join(", ")}
                            </p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Year:</span>
                            <p className="text-gray-800">{data.year}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Venue:</span>
                            <p className="text-gray-800">{data.venue || "N/A"}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-600">Paper ID:</span>
                            <p className="text-gray-800 text-xs">{data.paperId}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-md">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">
                                {data.citationCount}
                            </p>
                            <p className="text-sm text-gray-600">Total Citations</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">
                                {data.referenceCount}
                            </p>
                            <p className="text-sm text-gray-600">Total References</p>
                        </div>
                    </div>
                    {data.abstract && (
                        <div className="mt-4">
                            <span className="font-medium text-gray-600">Abstract:</span>
                            <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                                {data.abstract}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chart 1: Citation vs Reference Comparison */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Citation vs Reference Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Bar Chart */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                            Comparison Bar Chart
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={comparisonData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="count" fill="#8884d8">
                                    {comparisonData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                            Distribution Pie Chart
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({name, percent}) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                        <span className="font-medium">Citation Ratio:</span>{" "}
                        {data.referenceCount > 0
                            ? (data.citationCount / data.referenceCount).toFixed(2)
                            : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        This ratio indicates the paper&apos;s impact relative to its
                        reference base.
                    </p>
                </div>
            </div>

            {/* Chart 2: Citation Network Visualization */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Citation Network (Top 5)
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Citations */}
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center">
                            <span className="mr-2">←</span> Top Papers Citing This Paper
                        </h3>
                        {topCitations.length > 0 ? (
                            <div className="space-y-3">
                                {topCitations.map((citation, index) => (
                                    <div
                                        key={citation.paperId}
                                        className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-500"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-800">
                                                    {index + 1}. {citation.title}
                                                </p>
                                                {citation.authors && citation.authors.length > 0 && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {citation.authors
                                                            .slice(0, 3)
                                                            .map((a) => a.name)
                                                            .join(", ")}
                                                        {citation.authors.length > 3 ? " et al." : ""}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Year: {citation.year || "N/A"}
                                                </p>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <p className="text-lg font-bold text-blue-600">
                                                    {citation.citationCount || 0}
                                                </p>
                                                <p className="text-xs text-gray-500">citations</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No citation data available
                            </p>
                        )}
                    </div>

                    {/* Top References */}
                    <div>
                        <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                            <span className="mr-2">→</span> Top Papers This Paper References
                        </h3>
                        {topReferences.length > 0 ? (
                            <div className="space-y-3">
                                {topReferences.map((reference, index) => (
                                    <div
                                        key={reference.paperId}
                                        className="p-3 bg-green-50 rounded-md border-l-4 border-green-500"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm text-gray-800">
                                                    {index + 1}. {reference.title}
                                                </p>
                                                {reference.authors && reference.authors.length > 0 && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {reference.authors
                                                            .slice(0, 3)
                                                            .map((a) => a.name)
                                                            .join(", ")}
                                                        {reference.authors.length > 3 ? " et al." : ""}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Year: {reference.year || "N/A"}
                                                </p>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <p className="text-lg font-bold text-green-600">
                                                    {reference.citationCount || 0}
                                                </p>
                                                <p className="text-xs text-gray-500">citations</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No reference data available
                            </p>
                        )}
                    </div>
                </div>

                {/* Network Diagram Placeholder */}
                <div className="mt-8 p-6 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                    <div className="flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center space-x-8">
                                <div className="text-blue-600 text-sm">
                                    ← Citing Papers ({topCitations.length})
                                </div>
                                <div
                                    className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    Current
                                    <br/>
                                    Paper
                                </div>
                                <div className="text-green-600 text-sm">
                                    Referenced Papers ({topReferences.length}) →
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Network visualization showing citation relationships
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
