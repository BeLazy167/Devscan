# Devscan

## DevPost Analysis API

This API analyzes Devpost project links, extracting information and providing technical analysis using Firecrawl.

### Architecture

-   **MongoDB**: Used for persistent storage of analyzed Devpost projects
-   **In-memory caching**: Efficient caching mechanism to reduce redundant analyses
-   **Cheerio**: For scraping Devpost project pages
-   **Gemini API**: For AI-powered code analysis

### Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Create `.env.local` file with the following:
    ```
    MONGODB_URI=mongodb://localhost:27017/devposts
    GITHUB_TOKEN=your_github_token_here
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
4. Run the development server: `npm run dev`

### API Endpoints

#### Analyze a DevPost

```
POST /api/devpost
Content-Type: application/json

{
  "url": "https://devpost.com/software/project-name"
}
```

Response:

```json
{
    "url": "https://devpost.com/software/project-name",
    "title": "Project Name",
    "description": "Project description...",
    "techStack": ["React", "Node.js", "MongoDB"],
    "teamMembers": ["Member 1", "Member 2"],
    "repoUrl": "https://github.com/user/repo",
    "repoOwner": "user",
    "repoName": "repo",
    "demoUrl": "https://demo-url.com",
    "imageUrls": ["https://image1.jpg", "https://image2.jpg"],
    "analysis": {
        "summary": "Project summary...",
        "technicalHighlights": "Technical details...",
        "keyFeatures": ["Feature 1", "Feature 2"],
        "complexity": "Complexity assessment...",
        "useCases": ["Use case 1", "Use case 2"],
        "improvements": ["Improvement 1", "Improvement 2"]
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
}
```

#### Get DevPost(s)

```
GET /api/devpost
```

Response: Array of all DevPost objects

```
GET /api/devpost?url=https://devpost.com/software/project-name
```

Response: Single DevPost object or 404 if not found

#### Delete a DevPost

```
DELETE /api/devpost?url=https://devpost.com/software/project-name
```

Response:

```json
{
    "success": true
}
```
