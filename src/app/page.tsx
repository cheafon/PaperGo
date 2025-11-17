"use client";
import React from "react";
import "@copilotkit/react-ui/styles.css";
import "./style.css";
import { useCopilotAction} from "@copilotkit/react-core";
import {CopilotChat} from "@copilotkit/react-ui";
import Navbar from "@/components/Navbar";

export default function Home() {
    useCopilotAction({
        name: "read_file",
        available: "remote",
        render: () => {
            // alert("read_file")
            return (<div>======read_file=====</div>)
        }
    })

    return (
        <div>
            <Navbar />
            <CopilotChat/>
        </div>
    )
}
