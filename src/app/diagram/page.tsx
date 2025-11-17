import Navbar from "@/components/Navbar";
import PaperChart, {PaperData} from "@/components/PaperChart";

export default function Diagram() {
    const paperData: PaperData = {
        paperId: "...",
        title: "Example Paper",
        authors: [{name: "John Doe"}],
        year: 2024,
        venue: "Conference",
        citationCount: 150,
        referenceCount: 45,
        abstract: "...",
        citations: [],
        references: []
    };

    return (
        <div>
            {/*导航*/}
            <Navbar/>
            {/*图表*/}

            <PaperChart data={paperData} />
        </div>
    )
}