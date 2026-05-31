// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { EmailNode } from './nodes/emailNode';
import { APINode } from './nodes/apiNode';
import { MathNode } from './nodes/mathNode';
import { FilterNode } from './nodes/filterNode';
import { DelayNode } from './nodes/delayNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  email: EmailNode,
  api: APINode,
  math: MathNode,
  filter: FilterNode,
  delay: DelayNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

/* ─── Global canvas style overrides ─────────────────────────────── */
const canvasStyles = `
  .react-flow__controls {
    border-radius: 10px !important;
    overflow: hidden !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10) !important;
    border: 1px solid #e2e8f0 !important;
  }
  .react-flow__controls-button {
    background: #ffffff !important;
    border-bottom: 1px solid #f1f5f9 !important;
    color: #64748b !important;
    width: 28px !important;
    height: 28px !important;
    transition: background 0.15s ease !important;
  }
  .react-flow__controls-button:hover {
    background: #f8fafc !important;
    color: #6366f1 !important;
  }
  .react-flow__controls-button svg {
    fill: currentColor !important;
  }
  .react-flow__edge-path {
    stroke: #a5b4fc !important;
    stroke-width: 2 !important;
  }
  .react-flow__edge.selected .react-flow__edge-path {
    stroke: #6366f1 !important;
  }
  .react-flow__connection-line {
    stroke: #818cf8 !important;
    stroke-width: 2 !important;
  }
  .react-flow__minimap {
    border-radius: 10px !important;
    overflow: hidden !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
  }

  /* Hide minimap on very small screens */
  @media (max-width: 480px) {
    .react-flow__minimap {
      display: none !important;
    }
  }
`;

/* ─── useCanvasHeight: fluid height that fills remaining viewport ── */
const useCanvasHeight = () => {
  const [height, setHeight] = useState('72vh');

  useEffect(() => {
    const calculate = () => {
      const vh = window.innerHeight;
      // clamp: never shorter than 320px, never taller than 900px
      const px = Math.min(Math.max(Math.round(vh * 0.68), 320), 900);
      setHeight(`${px}px`);
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, []);

  return height;
};

/* ─── Inner canvas component (has access to ReactFlow context) ───── */
const CanvasInner = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { fitView } = useReactFlow();
  const canvasHeight = useCanvasHeight();
  const prevNodeCount = useRef(0);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  /* fitView on first node drop (empty → 1 node) */
  useEffect(() => {
    if (prevNodeCount.current === 0 && nodes.length === 1) {
      setTimeout(() => fitView({ padding: 0.4, duration: 350 }), 50);
    }
    prevNodeCount.current = nodes.length;
  }, [nodes.length, fitView]);

  /* fitView on window resize so edges/connections stay visible */
  useEffect(() => {
    if (nodes.length === 0) return;
    const onResize = () => fitView({ padding: 0.15, duration: 200 });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [nodes.length, fitView]);

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: `${type}` });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(false);

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(
          event.dataTransfer.getData('application/reactflow')
        );
        const type = appData?.nodeType;
        if (typeof type === 'undefined' || !type) return;

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setIsDragOver(false), []);

  /* ── Init handler: fitView after RF mounts ── */
  const onInit = useCallback(
    (instance) => {
      setReactFlowInstance(instance);
      if (nodes.length > 0) {
        setTimeout(() => instance.fitView({ padding: 0.15, duration: 300 }), 80);
      }
    },
    [nodes.length]
  );

  return (
    <>
      <style>{canvasStyles}</style>

      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '0 16px 20px',
          fontFamily: "'DM Sans', 'Figtree', 'Segoe UI', sans-serif",
        }}
      >
        {/* Canvas card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            border: isDragOver
              ? '1.5px solid rgba(99,102,241,0.45)'
              : '1px solid rgba(99,102,241,0.13)',
            boxShadow: isDragOver
              ? '0 0 0 4px rgba(99,102,241,0.08), 0 4px 24px rgba(99,102,241,0.12)'
              : '0 1px 4px rgba(0,0,0,0.05), 0 8px 32px rgba(99,102,241,0.07)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            background: '#f8faff',
          }}
        >
          {/* Dashed drop overlay */}
          {isDragOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                pointerEvents: 'none',
                background: 'rgba(99,102,241,0.03)',
                border: '2px dashed rgba(99,102,241,0.25)',
                borderRadius: '15px',
              }}
            />
          )}

          {/* ReactFlow canvas — fluid height */}
          <div
            ref={reactFlowWrapper}
            style={{ width: '100%', height: canvasHeight }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onInit={onInit}
              nodeTypes={nodeTypes}
              proOptions={proOptions}
              snapGrid={[gridSize, gridSize]}
              connectionLineType="smoothstep"
              fitView
              fitViewOptions={{ padding: 0.2 }}
              style={{ background: 'transparent', width: '100%', height: '100%' }}
            >
              <Background
                color="#c7d2fe"
                gap={gridSize}
                size={1}
                style={{ opacity: 0.55 }}
              />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const colors = {
                    customInput: '#10b981',
                    llm: '#6366f1',
                    customOutput: '#f59e0b',
                    text: '#0ea5e9',
                    email: '#ec4899',
                    api: '#8b5cf6',
                    math: '#14b8a6',
                    filter: '#f97316',
                    delay: '#94a3b8',
                  };
                  return colors[node.type] || '#94a3b8';
                }}
                maskColor="rgba(241,245,249,0.75)"
              />
            </ReactFlow>
          </div>

          {/* Empty state */}
          {nodes.length === 0 && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                  border: '1.5px solid #c7d2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  opacity: 0.8,
                }}
              >
                ⬡
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#94a3b8',
                  letterSpacing: '0.01em',
                  textAlign: 'center',
                  padding: '0 16px',
                }}
              >
                Drop nodes here to build your pipeline
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#cbd5e1',
                  fontWeight: 400,
                  textAlign: 'center',
                }}
              >
                Drag from the toolbar above to get started
              </div>
            </div>
          )}
        </div>

        {/* Footer status bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '10px',
            padding: '0 4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: nodes.length > 0 ? '#10b981' : '#e2e8f0',
                boxShadow: nodes.length > 0 ? '0 0 6px #10b98160' : 'none',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {nodes.length === 0
                ? 'Empty canvas'
                : `${nodes.length} node${nodes.length !== 1 ? 's' : ''} · ${edges.length} connection${edges.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          <span
            style={{
              fontSize: '10px',
              color: '#cbd5e1',
              fontWeight: 400,
              letterSpacing: '0.02em',
            }}
          >
            Snap to grid · {gridSize}px
          </span>
        </div>
      </div>
    </>
  );
};

/* ─── Public export — wraps inner component in ReactFlowProvider ─── */
export const PipelineUI = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);