import { useState, useEffect, useRef, useCallback } from 'react'

const COMMUNITY_COLORS = { tech: '#ffffff', arts: '#6b7280', science: '#404040' }

export default function NetworkViewer({ api }) {
  const [graph, setGraph] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const canvasRef = useRef(null)
  const posRef = useRef({})
  const velRef = useRef({})
  const animRef = useRef(null)

  useEffect(() => {
    fetch(`${api}/graph`).then(r => r.json()).then(setGraph)
  }, [api])

  const simulate = useCallback(() => {
    if (!graph || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.parentElement.clientWidth
    const H = canvas.parentElement.clientHeight
    canvas.width = W * devicePixelRatio
    canvas.height = H * devicePixelRatio
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'
    ctx.scale(devicePixelRatio, devicePixelRatio)

    const nodes = graph.nodes
    const edges = graph.edges
    const pos = posRef.current
    const vel = velRef.current

    nodes.forEach(n => {
      if (!pos[n.id]) {
        pos[n.id] = { x: W / 2 + (Math.random() - 0.5) * 300, y: H / 2 + (Math.random() - 0.5) * 200 }
        vel[n.id] = { x: 0, y: 0 }
      }
    })

    const degreeMap = {}
    edges.forEach(e => {
      degreeMap[e.source] = (degreeMap[e.source] || 0) + 1
      degreeMap[e.target] = (degreeMap[e.target] || 0) + 1
    })

    let iteration = 0
    const maxIter = 300

    function step() {
      iteration++
      const cooling = Math.max(0.01, 1 - iteration / maxIter)

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = pos[nodes[i].id], b = pos[nodes[j].id]
          let dx = a.x - b.x, dy = a.y - b.y
          let dist = Math.sqrt(dx * dx + dy * dy) || 1
          let force = 8000 / (dist * dist)
          let fx = (dx / dist) * force * cooling
          let fy = (dy / dist) * force * cooling
          vel[nodes[i].id].x += fx; vel[nodes[i].id].y += fy
          vel[nodes[j].id].x -= fx; vel[nodes[j].id].y -= fy
        }
      }

      edges.forEach(e => {
        const a = pos[e.source], b = pos[e.target]
        let dx = b.x - a.x, dy = b.y - a.y
        let dist = Math.sqrt(dx * dx + dy * dy) || 1
        let force = (dist - 120) * 0.02 * cooling
        let fx = (dx / dist) * force, fy = (dy / dist) * force
        vel[e.source].x += fx; vel[e.source].y += fy
        vel[e.target].x -= fx; vel[e.target].y -= fy
      })

      nodes.forEach(n => {
        vel[n.id].x += (W / 2 - pos[n.id].x) * 0.001
        vel[n.id].y += (H / 2 - pos[n.id].y) * 0.001
        vel[n.id].x *= 0.85; vel[n.id].y *= 0.85
        pos[n.id].x += vel[n.id].x
        pos[n.id].y += vel[n.id].y
        pos[n.id].x = Math.max(40, Math.min(W - 40, pos[n.id].x))
        pos[n.id].y = Math.max(40, Math.min(H - 40, pos[n.id].y))
      })

      ctx.clearRect(0, 0, W, H)

      edges.forEach(e => {
        const a = pos[e.source], b = pos[e.target]
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(255,255,255,${0.04 + e.weight * 0.12})`
        ctx.lineWidth = 0.5 + e.weight * 1.2
        ctx.stroke()
      })

      nodes.forEach(n => {
        const p = pos[n.id]
        const deg = degreeMap[n.id] || 1
        const r = 5 + deg * 1.2
        const color = COMMUNITY_COLORS[n.community] || '#666'

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = 0.9
        ctx.fill()
        ctx.globalAlpha = 1

        ctx.fillStyle = '#a3a3a3'
        ctx.font = '10px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(n.name, p.x, p.y - r - 5)
      })

      if (iteration < maxIter) animRef.current = requestAnimationFrame(step)
    }

    step()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [graph])

  useEffect(() => { const c = simulate(); return c }, [simulate])

  const handleMouseMove = (e) => {
    if (!graph || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const pos = posRef.current
    const degreeMap = {}
    graph.edges.forEach(e => {
      degreeMap[e.source] = (degreeMap[e.source] || 0) + 1
      degreeMap[e.target] = (degreeMap[e.target] || 0) + 1
    })
    for (const n of graph.nodes) {
      const p = pos[n.id]
      if (!p) continue
      const r = 5 + (degreeMap[n.id] || 1) * 1.2 + 4
      if ((mx - p.x) ** 2 + (my - p.y) ** 2 < r * r) {
        setTooltip({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10, node: n, degree: degreeMap[n.id] || 0 })
        return
      }
    }
    setTooltip(null)
  }

  if (!graph) return <div className="card"><div className="card-body"><div className="spinner" /></div></div>

  return (
    <div className="card">
      <div className="card-header">
        <h2>Social Network Graph</h2>
        <p className="card-subtitle">Force-directed layout of 15 nodes and {graph.edges.length} edges across 3 communities.</p>
      </div>
      <div className="card-body">
        <div className="legend-row">
          {Object.entries(COMMUNITY_COLORS).map(([name, color]) => (
            <span className="legend-dot" key={name}>
              <span style={{ background: color }} />
              {name}
            </span>
          ))}
        </div>
        <div className="network-canvas-wrap" onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)}>
          <canvas ref={canvasRef} />
          {tooltip && (
            <div className="graph-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              <strong>{tooltip.node.name}</strong>
              <span>Community: {tooltip.node.community}</span>
              <span>Age: {tooltip.node.age} | Degree: {tooltip.degree}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
