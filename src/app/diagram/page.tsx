"use client"
import Navbar from "@/components/Navbar";
import PaperChart, {PaperData} from "@/components/PaperChart";
import {useState,useEffect} from "react";

export default function Diagram() {
    const [paperData,setPaperData] = useState<PaperData>(null);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        async function fetchData(){
            try {
                const response = await fetch("http://")
                const data = await response.json()
                setPaperData(data)
            } catch (e) {
                console.log("获取数据失败：",e)
            } finally {

            }

        }
    })
    // const paperData: PaperData = {
    //     paperId: "...",
    //     title: "Example Paper",
    //     authors: [{name: "John Doe"}],
    //     year: 2024,
    //     venue: "Conference",
    //     citationCount: 150,
    //     referenceCount: 45,
    //     abstract: "...",
    //     citations: [],
    //     references: []
    // };

    return (
        <div>
            {/*导航*/}
            <Navbar/>
            {/*图表*/}
            <PaperChart data={paperData} />
        </div>
    )
}