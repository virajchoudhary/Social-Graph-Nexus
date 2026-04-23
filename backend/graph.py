import networkx as nx
import numpy as np

# mock social network -- 15 people, weighted relationships
def build_social_network():
    G = nx.Graph()

    people = [
        (0, {"name": "Alice", "age": 28, "community": "tech"}),
        (1, {"name": "Bob", "age": 32, "community": "tech"}),
        (2, {"name": "Charlie", "age": 25, "community": "tech"}),
        (3, {"name": "Diana", "age": 30, "community": "arts"}),
        (4, {"name": "Eve", "age": 27, "community": "arts"}),
        (5, {"name": "Frank", "age": 35, "community": "arts"}),
        (6, {"name": "Grace", "age": 29, "community": "science"}),
        (7, {"name": "Hank", "age": 31, "community": "science"}),
        (8, {"name": "Ivy", "age": 26, "community": "science"}),
        (9, {"name": "Jack", "age": 33, "community": "tech"}),
        (10, {"name": "Karen", "age": 24, "community": "arts"}),
        (11, {"name": "Leo", "age": 36, "community": "science"}),
        (12, {"name": "Mona", "age": 22, "community": "tech"}),
        (13, {"name": "Nate", "age": 29, "community": "arts"}),
        (14, {"name": "Olivia", "age": 34, "community": "science"}),
    ]
    G.add_nodes_from(people)

    edges = [
        (0, 1, 0.9, "friend"), (0, 2, 0.7, "colleague"), (0, 9, 0.6, "colleague"),
        (1, 2, 0.8, "friend"), (1, 9, 0.5, "colleague"), (1, 12, 0.4, "colleague"),
        (2, 12, 0.7, "friend"), (3, 4, 0.9, "friend"), (3, 5, 0.6, "colleague"),
        (3, 10, 0.8, "friend"), (3, 13, 0.5, "colleague"), (4, 5, 0.7, "friend"),
        (4, 10, 0.6, "friend"), (4, 13, 0.4, "colleague"), (5, 13, 0.5, "colleague"),
        (6, 7, 0.8, "friend"), (6, 8, 0.9, "friend"), (6, 11, 0.6, "colleague"),
        (6, 14, 0.5, "colleague"), (7, 8, 0.7, "friend"), (7, 11, 0.8, "friend"),
        (7, 14, 0.6, "colleague"), (8, 14, 0.7, "friend"), (8, 11, 0.4, "colleague"),
        (9, 12, 0.6, "friend"), (10, 13, 0.7, "friend"),
        # cross-community bridges
        (0, 3, 0.3, "colleague"), (1, 6, 0.4, "colleague"), (2, 8, 0.3, "colleague"),
        (5, 7, 0.2, "colleague"), (9, 11, 0.3, "colleague"), (10, 14, 0.2, "colleague"),
        (12, 13, 0.3, "colleague"), (4, 6, 0.2, "colleague"),
    ]
    for u, v, w, t in edges:
        G.add_edge(u, v, weight=w, type=t)

    return G

G = build_social_network()

def get_graph_data():
    nodes = [{"id": n, **G.nodes[n]} for n in G.nodes]
    edges = [{"source": u, "target": v, **G.edges[u, v]} for u, v in G.edges]
    return {"nodes": nodes, "edges": edges}

def get_node_list():
    return [{"id": n, "name": G.nodes[n]["name"]} for n in G.nodes]

def get_adjacency_matrix(weighted=False):
    nodes = sorted(G.nodes)
    labels = [G.nodes[n]["name"] for n in nodes]
    A = nx.to_numpy_array(G, nodelist=nodes, weight="weight" if weighted else None)
    return {"matrix": np.round(A, 2).tolist(), "labels": labels}

def get_degree_matrix(weighted=False):
    nodes = sorted(G.nodes)
    labels = [G.nodes[n]["name"] for n in nodes]
    A = nx.to_numpy_array(G, nodelist=nodes, weight="weight" if weighted else None)
    D = np.diag(A.sum(axis=1))
    return {"matrix": np.round(D, 2).tolist(), "labels": labels}

def get_laplacian_matrix(weighted=False):
    nodes = sorted(G.nodes)
    labels = [G.nodes[n]["name"] for n in nodes]
    A = nx.to_numpy_array(G, nodelist=nodes, weight="weight" if weighted else None)
    D = np.diag(A.sum(axis=1))
    L = D - A
    return {"matrix": np.round(L, 2).tolist(), "labels": labels}

def get_incidence_matrix():
    nodes = sorted(G.nodes)
    edges = list(G.edges)
    node_labels = [G.nodes[n]["name"] for n in nodes]
    edge_labels = [f"{G.nodes[u]['name']}-{G.nodes[v]['name']}" for u, v in edges]
    B = nx.incidence_matrix(G, nodelist=nodes, edgelist=edges).toarray()
    return {"matrix": B.astype(int).tolist(), "node_labels": node_labels, "edge_labels": edge_labels}
