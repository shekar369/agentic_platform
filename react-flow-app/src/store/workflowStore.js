import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';

const useWorkflowStore = create((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  updateNodeStatus: (nodeId, status) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, status } };
        }
        return node;
      }),
    });
  },

  updateEdgeStatus: (edgeId, status) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, data: { ...edge.data, status } };
        }
        return edge;
      }),
    });
  },

  clearAllStatuses: () => {
    set({
      nodes: get().nodes.map((node) => {
        const { status, ...restData } = node.data;
        return { ...node, data: restData };
      }),
      edges: get().edges.map((edge) => {
        const { status, ...restData } = edge.data;
        return { ...edge, data: restData };
      }),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  groupSelectedNodes: () => {
    const { nodes } = get();
    const selectedNodes = nodes.filter((node) => node.selected);

    if (selectedNodes.length < 2) return;

    const groupNodeId = `group-${Date.now()}`;
    const padding = 20;

    const minX = Math.min(...selectedNodes.map(n => n.position.x)) - padding;
    const minY = Math.min(...selectedNodes.map(n => n.position.y)) - padding;
    const maxX = Math.max(...selectedNodes.map(n => n.position.x + n.width)) + padding;
    const maxY = Math.max(...selectedNodes.map(n => n.position.y + n.height)) + padding;

    const groupNode = {
      id: groupNodeId,
      type: 'group',
      position: { x: minX, y: minY },
      data: { label: 'New Group' },
      style: {
        width: maxX - minX,
        height: maxY - minY,
        backgroundColor: 'rgba(208, 213, 221, 0.2)',
        borderColor: '#6b7280',
      },
    };

    const updatedNodes = nodes.map(node => {
      if (node.selected) {
        return {
          ...node,
          parentNode: groupNodeId,
          extent: 'parent',
          selected: false,
        };
      }
      return node;
    });

    set({
      nodes: [...updatedNodes, groupNode],
    });
  },
}));

export default useWorkflowStore;
