from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient

# 修正后的配置
# 注意：URL 只需要到服务器地址，不需要包含 /collections 路径
url = "https://4b87b799-b627-48dc-a79d-6297901ee1d7.us-west-2-0.aws.cloud.qdrant.io:6333/"
api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.FJw0LcG_tEYNIsX_JtmwOb14bzlhUHwnxEluHOifCa4"

from qdrant_client import QdrantClient
client = QdrantClient(url=url,api_key=api_key)
print(client.get_collections())

