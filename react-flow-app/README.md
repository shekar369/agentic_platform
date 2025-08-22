# AI Workflow Editor

## Overview

This project is a modern, web-based visual editor for creating and managing complex AI workflows. Built with React and powered by React Flow, it provides an intuitive drag-and-drop interface for orchestrating AI agents, tools, and logical conditions. The editor is designed to be a comprehensive solution for AI engineers, developers, and researchers to build, monitor, and manage sophisticated execution graphs without needing to write YAML or code by hand.

This application serves as a robust foundation, featuring a dynamic and responsive UI, centralized state management, and a mock backend for a complete development and testing experience out-of-the-box.

## Key Features

- **React Flow Canvas:** A powerful and performant drag-and-drop canvas for workflow orchestration.
- **Custom Node Types:** Pre-built custom nodes for different workflow components:
  - **Agent Node:** Represents an AI agent.
  - **Tool Node:** Represents a tool or external API call.
  - **Condition Node:** Represents a logical branch (`if/else`).
  - **Parallel Node:** Represents a block for parallel execution.
- **Dynamic Property Panels:** When a node is selected, a properties panel appears, dynamically rendering a configuration form based on a JSON schema specific to that node type.
- **Live Execution Monitoring (Simulated):** A mock WebSocket service simulates real-time workflow execution, with nodes and edges visually updating their status (e.g., a glowing border for a "running" node).
- **Context Menus:** Right-click on the canvas or on a node to access a context-aware menu for common actions like adding or deleting nodes.
- **Node Grouping:** Select two or more nodes and click the "Group" button to wrap them in a parent group node for better organization.
- **Resizable Layout:** The UI features a three-panel layout (Node Palette, Canvas, Properties) with resizable handles for a flexible user experience.

## Technology Stack

This project is built with a modern, robust, and scalable technology stack:

- **UI Framework:** [React](https://reactjs.org/)
- **Diagramming & Visualization:** [React Flow](https://reactflow.dev/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching & Caching:** [React Query](https://tanstack.com/query/v4)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Project Structure

The project follows a feature-oriented directory structure to keep the codebase organized and scalable.

```
src
├── components/
│   ├── nodes/      # Custom React Flow node components
│   └── ui/         # UI components from Shadcn
├── lib/
│   ├── api.js      # Axios client configuration
│   ├── mockApi.js  # Mock API for fetching/saving data
│   └── utils.js    # Utility functions (e.g., cn for classnames)
├── pages/
│   └── WorkflowEditorPage.js # The main page component for the editor
├── schemas/
│   └── *.schema.json # JSON schemas for each node type
└── store/
    └── workflowStore.js # Zustand global state store
```

## Getting Started

To get the project running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd react-flow-app
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## How to Use the Editor

- **Add Nodes:** Right-click on the canvas to open a context menu and add a new `Agent` or `Tool` node.
- **View Properties:** Click on any node to select it. The properties panel on the right will display its current data and a form to edit it.
- **Group Nodes:** Hold `Shift` and click on multiple nodes to select them. Click the "Group" button in the top-left toolbar to wrap them in a group.
- **Delete Nodes:** Right-click on a node to open its context menu and select "Delete Node".
- **Simulate Execution:** Click the "Run" button in the toolbar to watch the mock execution. Nodes will light up as they "run". Click "Stop" to end the simulation.
```
