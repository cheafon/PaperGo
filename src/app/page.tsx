"use client";
import React from "react";
import "@copilotkit/react-ui/styles.css";
import "./style.css";
import {useCopilotAction} from "@copilotkit/react-core";
import {CopilotChat, Markdown} from "@copilotkit/react-ui";
import Navbar from "@/components/Navbar";

export default function Home() {
    const chat = ()=> {
        // ...
        useCopilotAction({
            name: "write_essay",
            available: "remote",
            description: "Writes an essay and takes the draft as an argument.",
            parameters: [
                {name: "draft", type: "string", description: "The draft of the essay", required: true},
            ],
            followUp: false,
            renderAndWaitForResponse: ({args, respond, status}) => {
                return (
                    <div>
                        <Markdown content={args.draft || 'Preparing your draft...'}/>
                        <div className={`flex gap-4 pt-4 ${status !== "executing" ? "hidden" : ""}`}>
                            <button
                                onClick={() => {
                                    respond?.("CANCEL");
                                    alert("Draft canceled (ignored by default)");
                                }}
                                disabled={status !== "executing"}
                                className="border p-2 rounded-xl w-full"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => {
                                    respond?.("SEND");
                                    alert("Draft approved\n\nNow do something with it ✨");
                                }}
                                disabled={status !== "executing"}
                                className="bg-blue-500 text-white p-2 rounded-xl w-full"
                            >
                                Approve Draft
                            </button>
                        </div>
                    </div>
                );
            },
        });
        // ...
    }

    return (
        <div>
            <Navbar/>
            <CopilotChat/>
        </div>
    )
}
