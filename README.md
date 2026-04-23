# Social Graph Nexus
**Interactive graph theory explorer featuring social network visualization and GNN-based node embeddings.**

https://github.com/user-attachments/assets/9f0a9154-0a2b-4d7c-a2b4-c393a9db3a38

## Key Features
* **Interactive Graph Visualization:** Force-directed canvas renderer for exploring social connections across communities.
* **Automated Matrix Computation:** Real-time generation of Adjacency, Degree, Laplacian, and Incidence matrices with weighted/unweighted toggles.
* **Graph Neural Network (GNN) Foundation:** Practical implementation of 1-hop neighborhood aggregation and feature projection for node embeddings.

## Engineering Challenge: Framework-less GNN
This project demonstrates the core mathematical mechanics of Graph Representation Learning. 

Instead of relying on heavy frameworks like PyTorch Geometric, I implemented the message-passing and feature aggregation logic using pure **NumPy** and **NetworkX**. This approach makes the "black box" of GNNs transparent, allowing users to see exactly how node features are mean-aggregated from neighbors and transformed through linear layers and ReLU activations to produce dense embeddings.

## Tech Stack
* **Backend:** FastAPI (Python), NetworkX, NumPy
* **Frontend:** React (Vite), HTML5 Canvas API
* **Design:** Custom Dark-Mode Design System (Monochrome Aesthetic)

## API Endpoints

### 1. Social Network Data
`GET /graph`
Returns nodes and edges for the 15-node social network.

### 2. Graph Matrices
`GET /matrix/{type}?weighted=true`
Types: `adjacency`, `degree`, `laplacian`, `incidence`.

### 3. Node Embeddings
`GET /embedding/{node_id}`
Computes 1-hop aggregation and returns an 8-dimensional feature vector.

## Quick Start

### Local Setup
```bash
git clone https://github.com/virajchoudhary/Social-Graph-Nexus.git
cd social-graph-nexus

# Backend Setup
cd backend
python -m venv .venv
# On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend Setup
cd ../frontend
npm install
npm run dev
```
