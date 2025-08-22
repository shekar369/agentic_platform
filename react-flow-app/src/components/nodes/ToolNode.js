import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

function ToolNode({ data }) {
  const isRunning = data.status === 'running';

  return (
    <div className={cn(
      "p-4 border rounded-md shadow-md bg-secondary text-secondary-foreground w-64",
      isRunning && "ring-2 ring-green-500 animate-pulse"
    )}>
      <div className="font-bold text-lg mb-2">{data.label}</div>
      <div className="text-sm text-muted-foreground">
        <p>Type: Tool</p>
        <p>Description: {data.description || "No description"}</p>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary" />
    </div>
  );
}

export default ToolNode;
