export default function TheorySection() {
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2>Graph Representation</h2>
          <p className="card-subtitle">Core concepts for representing social network data as mathematical graphs.</p>
        </div>
        <div className="card-body">
          <div className="theory-grid">
            <div className="theory-item">
              <h4>Nodes and Vertices</h4>
              <p>
                A graph is a data structure containing nodes (vertices) and edges. In a social network,
                each node represents an entity such as a person, organization, or account. Nodes carry
                feature vectors describing attributes like age, community membership, or activity level.
              </p>
            </div>
            <div className="theory-item">
              <h4>Edges and Relationships</h4>
              <p>
                Edges are connections between two nodes that define relationships. In social networks,
                edges can represent friendships, collaborations, or interactions. Edges may be weighted
                to indicate relationship strength and can carry their own features such as type or duration.
              </p>
            </div>
            <div className="theory-item">
              <h4>Incidence Matrix</h4>
              <p>
                A matrix of size n x m where n is the number of nodes and m is the number of edges.
                Rows correspond to nodes and columns to edges. An entry is 1 if the node is incident
                to (connected by) that edge, and 0 otherwise.
              </p>
              <div className="formula">B[i,k] = 1 if node i is endpoint of edge k, else 0</div>
            </div>
            <div className="theory-item">
              <h4>Adjacency Matrix (A)</h4>
              <p>
                A square n x n matrix where entry A[i,j] is non-zero if there is an edge between node i
                and node j. In an unweighted graph the value is 1; in a weighted graph it equals the
                edge weight. For undirected graphs, A is symmetric.
              </p>
              <div className="formula">A[i,j] = w(i,j) if edge exists, else 0</div>
            </div>
            <div className="theory-item">
              <h4>Degree Matrix (D)</h4>
              <p>
                A diagonal n x n matrix where D[i,i] equals the degree of node i, i.e. the number of
                edges incident to it. For weighted graphs, the degree is the sum of incident edge weights.
                All off-diagonal entries are zero.
              </p>
              <div className="formula">D[i,i] = sum(A[i,j]) for all j</div>
            </div>
            <div className="theory-item">
              <h4>Laplacian Matrix (L)</h4>
              <p>
                Defined as L = D - A. The Laplacian captures the smoothness of a signal over the graph:
                it measures how quickly values change between adjacent vertices. Its eigenvalues reveal
                structural properties like connectivity and clustering.
              </p>
              <div className="formula">L = D - A</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Node Embedding via Message Passing</h2>
          <p className="card-subtitle">How GNNs compute node representations through neighborhood aggregation.</p>
        </div>
        <div className="card-body">
          <div className="algorithm">
            <p><strong>for</strong> each node v in graph G:</p>
            <p className="indent1">Collect features from neighbors N(v)</p>
            <p className="indent1">h_agg = MEAN(h_u <strong>for</strong> u in N(v))</p>
            <p className="indent1">h_combined = (h_v + h_agg) / 2</p>
            <p className="indent1">h_v' = ReLU(W * h_combined + b)</p>
          </div>
        </div>
      </div>
    </>
  )
}
