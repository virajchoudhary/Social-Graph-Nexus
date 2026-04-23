import { useState } from 'react'
import TheorySection from './components/TheorySection'
import NetworkViewer from './components/NetworkViewer'
import GraphMatrices from './components/GraphMatrices'
import NodeEmbeddings from './components/NodeEmbeddings'
import Footer from './components/Footer'
import './App.css'

const API = 'http://127.0.0.1:8000'

const tabs = [
  { id: 'theory', label: 'Theory', component: <TheorySection /> },
  { id: 'network', label: 'Network', component: <NetworkViewer api={API} /> },
  { id: 'matrices', label: 'Matrices', component: <GraphMatrices api={API} /> },
  { id: 'embeddings', label: 'Embeddings', component: <NodeEmbeddings api={API} /> },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('theory')

  return (
    <div className="app-layout">
      <nav className="sidebar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="main-content">
        <header className="app-header">
          <h1>Social Graph Nexus</h1>
          <p>Graph Representation for Social Networks using GNN Concepts</p>
        </header>
        {tabs.find(t => t.id === activeTab).component}
        <Footer />
      </main>
    </div>
  )
}
