from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
async def parse_pipeline(data: dict):

    nodes = data.get("nodes", [])
    edges = data.get("edges", [])

    num_nodes = len(nodes)
    num_edges = len(edges)

    # DAG Check
    graph = {node["id"]: [] for node in nodes}

    for edge in edges:
        graph[edge["source"]].append(edge["target"])

    visited = set()
    visiting = set()

    def has_cycle(node):
        if node in visiting:
            return True

        if node in visited:
            return False

        visiting.add(node)

        for neighbor in graph[node]:
            if has_cycle(neighbor):
                return True

        visiting.remove(node)
        visited.add(node)

        return False

    is_dag = True

    for node in graph:
        if has_cycle(node):
            is_dag = False
            break

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
    }