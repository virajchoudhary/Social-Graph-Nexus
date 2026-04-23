import { useState, useEffect, useRef } from 'react'

const COMM_COLORS = { tech: '#ffffff', arts: '#6b7280', science: '#404040' }

import { fetchFromApi } from '../api'

export default function NodeEmbeddings({ api }) {
  const [nodes, setNodes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetchFromApi('/nodes')
      .then(n => {
        if (n) {
          setNodes(n)
          if (n.length > 0) setSelectedId(n[0].id)
        }
      })
      .catch(err => console.error("Failed to fetch nodes:", err))
  }, [])

  useEffect(() => {
    if (selectedId === null) return
    let isMounted = true
    setLoading(true)
    fetchFromApi(`/embedding/${selectedId}`)
      .then(d => {
        if (isMounted && d) {
          setData(d)
          setLoading(false)
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Failed to fetch embedding:", err)
          setLoading(false)
        }
      })
    return () => { isMounted = false }
  }, [selectedId])

  // draw ego graph
  useEffect(() => {
    if (!data || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.parentElement.clientWidth
    const H = 280
    canvas.width = W * devicePixelRatio
    canvas.height = H * devicePixelRatio
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.clearRect(0, 0, W, H)

    const center = data.comp_graph.center
    const neighbors = data.comp_graph.neighbors
    const cx = W / 2, cy = H / 2

    const positions = neighbors.map((_, i) => {
      const angle = (2 * Math.PI * i) / neighbors.length - Math.PI / 2
      const rx = Math.min(W * 0.35, 150), ry = Math.min(H * 0.35, 90)
      return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry }
    })

    // edges
    positions.forEach((p, i) => {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(p.x, p.y)
      ctx.strokeStyle = `rgba(255,255,255,${0.06 + neighbors[i].edge_weight * 0.15})`
      ctx.lineWidth = 1 + neighbors[i].edge_weight * 1.5
      ctx.stroke()
      const mx = (cx + p.x) / 2, my = (cy + p.y) / 2
      ctx.fillStyle = '#6b7280'
      ctx.font = '9px JetBrains Mono, monospace'
      ctx.textAlign = 'center'
      ctx.fillText(neighbors[i].edge_weight.toFixed(1), mx, my - 4)
    })

    // neighbor nodes
    positions.forEach((p, i) => {
      const n = neighbors[i]
      ctx.beginPath()
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2)
      ctx.fillStyle = COMM_COLORS[n.community] || '#666'
      ctx.globalAlpha = 0.8
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = n.community === 'tech' ? '#000' : '#fff'
      ctx.font = 'bold 8px system-ui'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.name.slice(0, 3), p.x, p.y)
      ctx.fillStyle = '#6b7280'
      ctx.font = '8px system-ui'
      ctx.fillText(n.edge_type, p.x, p.y + 20)
    })

    // center node
    ctx.beginPath()
    ctx.arc(cx, cy, 20, 0, Math.PI * 2)
    ctx.fillStyle = COMM_COLORS[center.community] || '#666'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = center.community === 'tech' ? '#000' : '#fff'
    ctx.font = 'bold 10px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(center.name, cx, cy)
  }, [data])

  const maxEmbed = data ? Math.max(...data.embedding.map(Math.abs), 0.001) : 1

  return (
    <div className="card">
      <div className="card-header">
        <h2>Node Embeddings</h2>
        <p className="card-subtitle">Select a node to view its 1-hop computational graph and feature embedding.</p>
      </div>
      <div className="card-body">
        <div className="select-wrap" style={{ maxWidth: 260, marginBottom: 24 }}>
          <select value={selectedId ?? ''} onChange={e => setSelectedId(Number(e.target.value))}>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.name} (id: {n.id})</option>)}
          </select>
        </div>

        {loading ? <div className="spinner" /> : data && (
          <div className="embedding-grid">
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Computational Graph</h4>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <canvas ref={canvasRef} />
              </div>
              <div className="neighbor-list" style={{ marginTop: 16 }}>
                {data.comp_graph.neighbors.map(n => (
                  <div className="neighbor-item" key={n.id}>
                    <span>{n.name} <span className="type-badge">{n.community}</span></span>
                    <span className="weight">{n.edge_type} | w={n.edge_weight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: 'var(--text-primary)' }}>Embedding (dim={data.embedding_dim})</h4>
              <div className="embedding-vector">
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Input: </span>
                  <span>[{data.input_features.join(', ')}]</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Aggregated: </span>
                  <span>[{data.aggregated_features.join(', ')}]</span>
                </div>
                <div style={{ marginBottom: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  h = ReLU(W * x + b)
                </div>
                {data.embedding.map((val, i) => (
                  <div className="embedding-bar" key={i}>
                    <span style={{ minWidth: 20, color: 'var(--text-muted)', fontSize: '0.75rem' }}>d{i}</span>
                    <div className="bar" style={{ width: `${(Math.abs(val) / maxEmbed) * 100}%` }} />
                    <span className="val">{val.toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
