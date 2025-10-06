# Zipp Bot Frontend

Simple CRUD interface for managing company knowledge base.

## Features

### Dashboard

- Create/Read/Delete companies
- Vector search across company knowledge base
- Real-time search results with relevance scores

### Departments

- Full CRUD operations for departments
- Link departments to companies
- View department services count

### Services

- Full CRUD operations for services
- Link services to departments
- View common issues count

### Common Issues

- Full CRUD operations for common issues
- Link issues to services
- JSON solutions support

## Pages Structure

- `/dashboard` - Company management + search
- `/departments` - Department management
- `/services` - Service management
- `/common-issues` - Common issues management

## API Integration

All pages connect to the backend API at `http://localhost:3000/api`

Make sure your backend server is running before using the frontend.

## Usage

1. Start backend server: `npm run dev` (in Backend folder)
2. Start frontend: `npm run dev` (in Frontend folder)
3. Navigate to the dashboard to create companies
4. Add departments, services, and common issues
5. Use search functionality to test vector embeddings

## Key Features

- **Real-time CRUD**: All operations immediately sync with backend
- **Vector Search**: Semantic search across all company data
- **Hierarchical Data**: Company -> Department -> Service -> Issues
- **Simple UI**: Focus on functionality over design
- **Type Safety**: TypeScript interfaces for all data structures
