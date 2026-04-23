import { useState } from 'react'
import TheorySection from './components/TheorySection'
import NetworkViewer from './components/NetworkViewer'
import GraphMatrices from './components/GraphMatrices'
import NodeEmbeddings from './components/NodeEmbeddings'
import Footer from './components/Footer'
import './App.css'

import { API_BASE_URL } from './api'

const tabs = [
  { id: 'theory', label: 'Theory', component: <TheorySection /> },
  { id: 'network', label: 'Network', component: <NetworkViewer api={API_BASE_URL} /> },
  { id: 'matrices', label: 'Matrices', component: <GraphMatrices api={API_BASE_URL} /> },
  { id: 'embeddings', label: 'Embeddings', component: <NodeEmbeddings api={API_BASE_URL} /> },
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
