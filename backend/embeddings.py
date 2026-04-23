import numpy as np
import networkx as nx
from graph import G

# fixed seed for reproducible embeddings
rng = np.random.RandomState(42)

# community one-hot encoding
COMMUNITIES = ["tech", "arts", "science"]

def node_features(node_id):
    """feature vector: [one-hot community (3)] + [normalized age (1)] = dim 4"""
    data = G.nodes[node_id]
    comm = [1.0 if data["community"] == c else 0.0 for c in COMMUNITIES]
    age_norm = data["age"] / 40.0  # rough normalization
    return np.array(comm + [age_norm])

FEAT_DIM = 4
EMBED_DIM = 8

# single-layer weight matrix (fixed random)
W = rng.randn(FEAT_DIM, EMBED_DIM) * 0.5
b = rng.randn(EMBED_DIM) * 0.1

def compute_embedding(node_id):
    """single-layer message-passing: aggregate neighbor features, transform, ReLU"""
    if node_id not in G.nodes:
        return None

    ego = nx.ego_graph(G, node_id, radius=1)
    neighbors = [n for n in ego.nodes if n != node_id]

    # aggregate: mean of neighbor features
    if neighbors:
        neighbor_feats = np.stack([node_features(n) for n in neighbors])
        agg = neighbor_feats.mean(axis=0)
    else:
        agg = np.zeros(FEAT_DIM)

    # combine self + aggregated neighbors
    self_feat = node_features(node_id)
    combined = (self_feat + agg) / 2.0

    # transform: h = ReLU(W^T * x + b)
    embedding = np.maximum(0, combined @ W + b)

    # build computational graph info
    comp_graph = {
        "center": {"id": node_id, **G.nodes[node_id]},
        "neighbors": [
            {
                "id": n,
                **G.nodes[n],
                "edge_weight": G.edges[node_id, n]["weight"],
                "edge_type": G.edges[node_id, n]["type"],
            }
            for n in neighbors
        ],
    }

    return {
        "node_id": node_id,
        "name": G.nodes[node_id]["name"],
        "input_features": np.round(self_feat, 4).tolist(),
        "aggregated_features": np.round(agg, 4).tolist(),
        "embedding": np.round(embedding, 4).tolist(),
        "embedding_dim": EMBED_DIM,
        "comp_graph": comp_graph,
    }
