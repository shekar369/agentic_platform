import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactFlow, Controls, MiniMap, Background, useReactFlow } from 'reactflow';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import ContextMenu from '@/components/ContextMenu';

import useWorkflowStore from '@/store/workflowStore';
import mockSocket from '@/lib/mockWebSocket';
import { fetchWorkflow } from '@/lib/mockApi';
import AgentNode from '@/components/nodes/AgentNode';
import ToolNode from '@/components/nodes/ToolNode';
import ConditionNode from '@/components/nodes/ConditionNode';
import ParallelNode from '@/components/nodes/ParallelNode';
import PropertiesPanel from '@/components/PropertiesPanel';

const nodeTypes = {
  agent: AgentNode,
  tool: ToolNode,
  condition: ConditionNode,
  parallel: ParallelNode,
};

function WorkflowEditorPage() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNodeData,
    setNodes,
    setEdges,
    updateNodeStatus,
    updateEdgeStatus,
    clearAllStatuses,
    addNode,
    deleteNode,
    groupSelectedNodes,
  } = useWorkflowStore();

  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  // Fetch workflow data on component mount
  useQuery({
    queryKey: ['workflow', '1'],
    queryFn: () => fetchWorkflow('1'),
    onSuccess: (data) => {
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    },
  });

  // Effect to manage WebSocket listeners
  useEffect(() => {
    const handleNodeStatus = ({ nodeId, status }) => updateNodeStatus(nodeId, status);
    const handleEdgeStatus = ({ edgeId, status }) => updateEdgeStatus(edgeId, status);
    const handleExecutionStatus = ({ status }) => {
      if (status === 'completed') {
        setIsExecuting(false);
        setTimeout(clearAllStatuses, 2000);
      }
    };
    mockSocket.on('nodeStatus', handleNodeStatus);
    mockSocket.on('edgeStatus', handleEdgeStatus);
    mockSocket.on('executionStatus', handleExecutionStatus);
    return () => {
      mockSocket.off('nodeStatus', handleNodeStatus);
      mockSocket.off('edgeStatus', handleEdgeStatus);
      mockSocket.off('executionStatus', handleExecutionStatus);
    };
  }, [updateNodeStatus, updateEdgeStatus, clearAllStatuses]);

  const onSelectionChange = useCallback(({ nodes }) => {
    setSelectedNodes(nodes);
  }, []);

  const handleRunWorkflow = () => {
    clearAllStatuses();
    setIsExecuting(true);
    mockSocket.connect({ nodes, edges });
  };

  const handleStopWorkflow = () => {
    setIsExecuting(false);
    mockSocket.disconnect();
    clearAllStatuses();
  };

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setMenu({
      id: node.id,
      top: event.clientY,
      left: event.clientX,
      items: [
        { label: 'Delete Node', onClick: () => deleteNode(node.id) },
      ],
    });
  }, [deleteNode]);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setMenu({
      id: 'pane-menu',
      top: event.clientY,
      left: event.clientX,
      items: [
        { label: 'Add Agent Node', onClick: () => addNode({
            id: `new-${Date.now()}`,
            type: 'agent',
            position,
            data: { label: 'New Agent' }
          })
        },
        { label: 'Add Tool Node', onClick: () => addNode({
            id: `new-${Date.now()}`,
            type: 'tool',
            position,
            data: { label: 'New Tool' }
          })
        },
      ],
    });
  }, [screenToFlowPosition, addNode]);

  const onMenuClose = () => setMenu(null);

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col" ref={ref}>
      <header className="p-2 border-b">
        <h1 className="text-xl font-bold">Workflow Editor</h1>
      </header>
      <div className="flex-grow">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={15} minSize={10}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Node Palette</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="relative h-full w-full" onContextMenuCapture={() => setMenu(null)}>
              <div className="absolute top-2 left-2 z-10 space-x-2">
                <Button onClick={handleRunWorkflow} disabled={isExecuting}>Run</Button>
                <Button onClick={handleStopWorkflow} disabled={!isExecuting} variant="destructive">Stop</Button>
                <Button onClick={groupSelectedNodes} disabled={selectedNodes.length < 2}>Group</Button>
              </div>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onSelectionChange={onSelectionChange}
                onNodeContextMenu={onNodeContextMenu}
                onPaneContextMenu={onPaneContextMenu}
                nodeTypes={nodeTypes}
                className="h-full w-full"
                fitView
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
              {menu && (
                <div style={{ top: menu.top, left: menu.left, position: 'absolute' }} onMouseLeave={onMenuClose}>
                  <ContextMenu items={menu.items} />
                </div>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={15}>
            <PropertiesPanel
              key={selectedNodes.length === 1 ? selectedNodes[0].id : 'no-node'}
              node={selectedNodes.length === 1 ? selectedNodes[0] : null}
              onNodeDataChange={updateNodeData}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

// React Flow Provider is needed for useReactFlow hook
import { ReactFlowProvider } from 'reactflow';

function WorkflowEditorPageWrapper() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorPage />
    </ReactFlowProvider>
  );
}

export default WorkflowEditorPageWrapper;
