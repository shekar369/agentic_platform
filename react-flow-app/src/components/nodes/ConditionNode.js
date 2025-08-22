import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

function ConditionNode({ data }) {
  const isRunning = data.status === 'running';

  return (
    <div className={cn(
      "p-4 border rounded-md shadow-md bg-accent text-accent-foreground w-64 transform -skew-x-12",
      isRunning && "ring-2 ring-green-500 animate-pulse"
    )}>
      <div className="font-bold text-lg mb-2 skew-x-12">{data.label}</div>
      <div className="text-sm text-muted-foreground skew-x-12">
        <p>Type: Condition</p>
        <p>Expression: {data.expression || "Not set"}</p>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
      <Handle type="source" position={Position.Bottom} id="true" style={{ left: '25%' }} className="w-2 h-2 !bg-green-500" />
      <Handle type="source" position={Position.Bottom} id="false" style={{ left: '75%' }} className="w-2 h-2 !bg-red-500" />
    </div>
  );
}

export default ConditionNode;
