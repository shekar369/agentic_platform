import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

function ParallelNode({ data }) {
  const isRunning = data.status === 'running';

  return (
    <div className={cn(
      "p-4 border-2 border-dashed rounded-md shadow-lg bg-background text-foreground w-96",
      isRunning && "ring-2 ring-green-500 animate-pulse"
    )}>
      <div className="font-bold text-center text-lg mb-2">{data.label}</div>
      <div className="text-sm text-muted-foreground text-center">
        <p>Type: Parallel Execution</p>
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-primary" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-primary" />
    </div>
  );
}

export default ParallelNode;
