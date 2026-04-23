import { useState, useEffect } from 'react'

const MATRIX_TYPES = [
  { id: 'adjacency', label: 'Adjacency' },
  { id: 'degree', label: 'Degree' },
  { id: 'laplacian', label: 'Laplacian' },
  { id: 'incidence', label: 'Incidence' },
]

import { fetchFromApi } from '../api'

export default function GraphMatrices({ api }) {
  const [selected, setSelected] = useState('adjacency')
  const [weighted, setWeighted] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    setData(null)
    setLoading(true)
    
    const params = selected !== 'incidence' ? `?weighted=${weighted}` : ''
    fetchFromApi(`/matrix/${selected}${params}`)
      .then(d => {
        if (isMounted) {
          setData(d)
          setLoading(false)
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Failed to fetch matrix:", err)
          setLoading(false)
        }
      })
      
    return () => { isMounted = false }
  }, [selected, weighted])

  const isIncidence = selected === 'incidence'
  const rowLabels = isIncidence ? data?.node_labels : data?.labels
  const colLabels = isIncidence ? data?.edge_labels : data?.labels

  return (
    <div className="card">
      <div className="card-header">
        <h2>Graph Matrices</h2>
        <p className="card-subtitle">Computed matrix representations of the social network.</p>
      </div>
      <div className="card-body">
        <div className="controls-row">
          {MATRIX_TYPES.map(m => (
            <button key={m.id} className={`btn-sm ${selected === m.id ? 'active' : ''}`} onClick={() => setSelected(m.id)}>
              {m.label}
            </button>
          ))}
          {selected !== 'incidence' && (
            <button
              className={`btn-sm ${weighted ? 'active' : ''}`}
              onClick={() => setWeighted(w => !w)}
            >
              Weighted
            </button>
          )}
        </div>
        {loading ? <div className="spinner" /> : data && rowLabels && colLabels && (
          <div style={{ overflowX: 'auto' }}>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th></th>
                  {colLabels.map((l, i) => <th key={i} style={isIncidence ? { fontSize: '0.68rem', writingMode: 'vertical-rl' } : {}}>{l}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.matrix.map((row, i) => (
                  <tr key={i}>
                    <th>{rowLabels[i]}</th>
                    {row.map((val, j) => <td key={j} className={val !== 0 ? 'nonzero' : ''}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
