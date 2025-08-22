import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WorkflowEditorPage from './pages/WorkflowEditorPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <WorkflowEditorPage />
      </div>
    </QueryClientProvider>
  );
}

export default App;
