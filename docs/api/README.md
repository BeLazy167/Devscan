# API Documentation

This document describes the API endpoints and their usage.

## DevPost Integration

### Analyze DevPost Project

```http
POST /api/devpost
```

Analyzes a DevPost project and its associated GitHub repository.

#### Request Body

```json
{
    "id": "project-id"
}
```

#### Response

```json
{
    "success": true,
    "data": {
        "source": "fresh|cached",
        "projectData": {
            "id": "string",
            "analysis": {
                // DevPost analysis data
            },
            "githubAnalysis": {
                "summary": "string",
                "technicalHighlights": "string",
                "keyFeatures": ["string"],
                "complexity": "string",
                "useCases": ["string"],
                "improvements": ["string"]
            }
        }
    }
}
```

## Project Search

### Search Projects

```http
GET /api/projects/search?query=keyword&tech=react&page=1&limit=10
```

Searches for projects based on provided parameters.

#### Query Parameters

| Parameter | Description                                   | Default | Example    |
| --------- | --------------------------------------------- | ------- | ---------- |
| `query`   | Search term (titles, descriptions, summaries) | ""      | blockchain |
| `tech`    | Filter by technology                          | ""      | react      |
| `page`    | Current page number                           | 1       | 2          |
| `limit`   | Number of results per page                    | 10      | 20         |

#### Response

```json
{
    "success": true,
    "data": {
        "results": [
            {
                "id": "string",
                "title": "string",
                "description": "string",
                "techStack": ["string"],
                "image": "string",
                "github": "string",
                "devpost": "string",
                "analysis": {
                    "summary": "string",
                    "score": 85
                }
            }
        ],
        "pagination": {
            "total": 42,
            "page": 1,
            "limit": 10,
            "pages": 5
        }
    }
}
```

## GitHub Analysis

The GitHub analysis service provides detailed technical analysis of repositories.

### Analysis Response Structure

```typescript
interface RepoAnalysis {
    summary: string;
    technicalHighlights: string;
    keyFeatures: string[];
    complexity: string;
    useCases: string[];
    improvements: string[];
    lastAnalyzed: string;
    analysisQuality: "basic" | "detailed";
}
```

## Database Schema

### RawDevPost Schema

```typescript
interface RawDevPost {
    scrapeData: Object;
    githubUrl: string;
    createdAt: Date;
    updatedAt: Date;
    id: string;
}
```

### DevPost Schema

```typescript
interface Devpost {
    id: string;
    analysis: Object;
    githubAnalysis: Object;
    createdAt: Date;
    updatedAt: Date;
}
```

## Error Handling

The API uses standard HTTP status codes:

-   200: Success
-   400: Bad Request
-   404: Not Found
-   429: Rate Limit Exceeded
-   500: Internal Server Error

Error responses follow this format:

```json
{
    "error": "Error message description"
}
```
