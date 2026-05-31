# VectorShift Frontend Technical Assessment

## Features

* Reusable BaseNode abstraction
* Five custom nodes: Email, API, Math, Filter, Delay
* Dynamic Text Node with variable detection using `{{variable}}`
* Auto-resizing Text Node
* ReactFlow-based workflow builder
* Modernized UI and styling
* FastAPI backend integration
* Node and edge counting
* DAG validation

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Backend Setup

```bash
cd backend
py -m uvicorn main:app --reload
```

## Usage

1. Create and connect nodes in the workflow editor.
2. Click **Submit Pipeline**.
3. The backend returns:

   * Number of nodes
   * Number of edges
   * DAG validation result

## Technologies Used

* React
* React Flow
* Zustand
* FastAPI
* Python
