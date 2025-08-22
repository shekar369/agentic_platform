class MockWebSocket {
  constructor() {
    this.listeners = {};
    this.intervalId = null;
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  connect(workflow) {
    if (this.intervalId) {
      this.disconnect();
    }
    console.log("Mock WebSocket connected.");

    // Simulate a workflow execution
    let step = 0;
    const executionOrder = [];
    workflow.nodes.forEach(node => {
      executionOrder.push({ type: 'node', id: node.id });
      const edge = workflow.edges.find(e => e.source === node.id);
      if (edge) {
        executionOrder.push({ type: 'edge', id: edge.id });
      }
    });

    this.intervalId = setInterval(() => {
      if (step >= executionOrder.length) {
        this.emit('executionStatus', { status: 'completed' });
        this.disconnect();
        return;
      }

      const currentStep = executionOrder[step];
      if (currentStep.type === 'node') {
        this.emit('nodeStatus', { nodeId: currentStep.id, status: 'running' });
      } else {
        this.emit('edgeStatus', { edgeId: currentStep.id, status: 'active' });
      }

      step++;
    }, 1500); // Emit an event every 1.5 seconds
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Mock WebSocket disconnected.");
    }
  }
}

// Export a singleton instance
const mockSocket = new MockWebSocket();
export default mockSocket;
