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
