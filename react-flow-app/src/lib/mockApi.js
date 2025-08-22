import mockDb from './mock-db.json';

// In a real app, you wouldn't mutate the import directly,
// but for this mock, it's the simplest approach.
let db = JSON.parse(JSON.stringify(mockDb));

const networkDelay = 500; // ms

export const fetchWorkflow = (workflowId) => {
  console.log(`Fetching workflow: ${workflowId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (db.workflows[workflowId]) {
        resolve(db.workflows[workflowId]);
      } else {
        reject(new Error('Workflow not found'));
      }
    }, networkDelay);
  });
};

export const saveWorkflow = (workflowId, workflowData) => {
  console.log(`Saving workflow: ${workflowId}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      db.workflows[workflowId] = {
        ...db.workflows[workflowId],
        ...workflowData,
      };
      resolve(db.workflows[workflowId]);
    }, networkDelay);
  });
};
