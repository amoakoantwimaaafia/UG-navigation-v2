// API service layer for connecting to Java backend endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export interface RouteRequest {
  from: string
  to: string
  algorithm?: string
  landmark?: string
}

export interface RouteResponse {
  id: string
  algorithm: string
  distance: number
  time: number
  landmarks: string[]
  path: Array<{ lat: number; lng: number }>
  description: string
}

export interface LocationSuggestion {
  id: string
  name: string
  type: "building" | "landmark" | "facility"
  coordinates: { lat: number; lng: number }
}

class CampusNavigationAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Find routes between two locations
  async findRoutes(request: RouteRequest): Promise<RouteResponse[]> {
    return this.request<RouteResponse[]>("/routes/find", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  // Get location suggestions for autocomplete
  async getLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
    return this.request<LocationSuggestion[]>(`/locations/search?q=${encodeURIComponent(query)}`)
  }

  // Get all available landmarks
  async getLandmarks(): Promise<LocationSuggestion[]> {
    return this.request<LocationSuggestion[]>("/locations/landmarks")
  }

  // Get route details by ID
  async getRouteDetails(routeId: string): Promise<RouteResponse> {
    return this.request<RouteResponse>(`/routes/${routeId}`)
  }

  // Calculate route using specific algorithm
  async calculateRoute(
    from: string,
    to: string,
    algorithm: "dijkstra" | "astar" | "floyd" | "criticalpath" | "routesearch" | "transportation" | "mergesort",
    options?: { landmark?: string; avoidStairs?: boolean },
  ): Promise<RouteResponse> {
    return this.request<RouteResponse>("/routes/calculate", {
      method: "POST",
      body: JSON.stringify({
        from,
        to,
        algorithm,
        ...options,
      }),
    })
  }

  async dijkstraRoute(from: string, to: string, landmark?: string): Promise<RouteResponse> {
    return this.request<RouteResponse>("/dijkstra/calculate", {
      method: "POST",
      body: JSON.stringify({ from, to, landmark }),
    })
  }

  async astarRoute(from: string, to: string, landmark?: string): Promise<RouteResponse> {
    return this.request<RouteResponse>("/astar/calculate", {
      method: "POST",
      body: JSON.stringify({ from, to, landmark }),
    })
  }

  async floydWarshallRoute(from: string, to: string): Promise<RouteResponse> {
    return this.request<RouteResponse>("/floyd-warshall/calculate", {
      method: "POST",
      body: JSON.stringify({ from, to }),
    })
  }

  async criticalPathRoute(from: string, to: string, tasks?: string[]): Promise<RouteResponse> {
    return this.request<RouteResponse>("/critical-path/calculate", {
      method: "POST",
      body: JSON.stringify({ from, to, tasks }),
    })
  }

  async routeSearchOptimized(from: string, to: string, criteria?: string): Promise<RouteResponse> {
    return this.request<RouteResponse>("/route-search/calculate", {
      method: "POST",
      body: JSON.stringify({ from, to, criteria }),
    })
  }

  async transportationProblem(from: string, to: string, capacity?: number): Promise<RouteResponse> {
    return this.request<RouteResponse>("/transportation/calculate", {
      method: "POST",
      body: JSON.stringify({ from, to, capacity }),
    })
  }

  async mergeSortOptimized(routes: RouteResponse[]): Promise<RouteResponse[]> {
    return this.request<RouteResponse[]>("/merge-sort/optimize", {
      method: "POST",
      body: JSON.stringify({ routes }),
    })
  }
}

export const campusAPI = new CampusNavigationAPI()

// Error handling utility
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "APIError"
  }
}

// Request interceptor for error handling
export const handleAPIError = (error: unknown): APIError => {
  if (error instanceof APIError) {
    return error
  }

  if (error instanceof Error) {
    return new APIError(error.message)
  }

  return new APIError("An unexpected error occurred")
}
