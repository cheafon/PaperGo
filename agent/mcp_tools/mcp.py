from llama_index.tools.mcp import BasicMCPClient, McpToolSpec


scholar_client = BasicMCPClient("https://server.smithery.ai/@hamid-vakilzadeh/mcpsemanticscholar/mcp?api_key=e2404846-5a81-4a02-91c3-a5504703a745&profile=intellectual-toucan-DB0osA")
websearch_client = BasicMCPClient("https://mcp.exa.ai/mcp?api_key=e2404846-5a81-4a02-91c3-a5504703a745&profile=intellectual-toucan-DB0osA")
filesystem_client = BasicMCPClient("https://server.smithery.ai/@bhushangitfull/file-mcp-smith/mcp?api_key=e2404846-5a81-4a02-91c3-a5504703a745&profile=intellectual-toucan-DB0osA")

async def get_backend_tools():
    scholar_tools =  await McpToolSpec(client=scholar_client).to_tool_list_async()
    websearch_tools = await McpToolSpec(client=websearch_client).to_tool_list_async()
    filesystem_tools = await McpToolSpec(client=filesystem_client).to_tool_list_async()
    backend_tools = scholar_tools + websearch_tools + filesystem_tools
    return backend_tools

