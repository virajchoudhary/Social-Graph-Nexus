from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from graph import get_graph_data, get_node_list, get_adjacency_matrix, get_degree_matrix, get_laplacian_matrix, get_incidence_matrix
from embeddings import compute_embedding

app = FastAPI(title="Social Graph Nexus API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/graph")
def graph():
    return get_graph_data()

@app.get("/nodes")
def nodes():
    return get_node_list()

@app.get("/matrix/adjacency")
def adjacency(weighted: bool = Query(False)):
    return get_adjacency_matrix(weighted)

@app.get("/matrix/degree")
def degree(weighted: bool = Query(False)):
    return get_degree_matrix(weighted)

@app.get("/matrix/laplacian")
def laplacian(weighted: bool = Query(False)):
    return get_laplacian_matrix(weighted)

@app.get("/matrix/incidence")
def incidence():
    return get_incidence_matrix()

@app.get("/embedding/{node_id}")
def embedding(node_id: int):
    result = compute_embedding(node_id)
    if result is None:
        return {"error": "Node not found"}
    return result
