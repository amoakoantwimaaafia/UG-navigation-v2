"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, Route, Zap, Target, Brain, GitBranch, BarChart3, Search, Truck } from "lucide-react"

interface RouteResult {
  id: string
  algorithm: string
  distance: number
  time: number
  landmarks: string[]
  description: string
}

export default function CampusNavigator() {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [selectedLandmark, setSelectedLandmark] = useState("")
  const [algorithm, setAlgorithm] = useState("")
  const [routes, setRoutes] = useState<RouteResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const landmarks = [
    "Main Library",
    "Great Hall",
    "JQB",
    "Night Market",
    "Pentagon Hostel",
    "Legon Hall",
    "Commonwealth Hall",
    "Akuafo Hall",
    "Volta Hall",
    "Engineering Block",
    "Business School",
    "Sports Complex",
    "N Block",
    "Law Faculty",
  ]

  const algorithms = [
    { value: "dijkstra", label: "Dijkstra's Algorithm", icon: Target },
    { value: "astar", label: "A* Search", icon: Zap },
    { value: "floyd", label: "Floyd-Warshall", icon: Brain },
    { value: "criticalpath", label: "Critical Path Method", icon: GitBranch },
    { value: "routesearch", label: "Route Search", icon: Search },
    { value: "transportation", label: "Transportation Problem", icon: Truck },
    { value: "mergesort", label: "MergeSort Optimization", icon: BarChart3 },
  ]

  const handleFindRoutes = async () => {
    if (!fromLocation || !toLocation) return

    setIsLoading(true)

    // Simulate API call to Java backend
    setTimeout(() => {
      const mockRoutes: RouteResult[] = [
        {
          id: "1",
          algorithm: algorithm || "dijkstra",
          distance: 1.2,
          time: 8,
          landmarks: ["Main Library", "JQB"],
          description: "Shortest path via academic area",
        },
        {
          id: "2",
          algorithm: algorithm || "astar",
          distance: 1.4,
          time: 7,
          landmarks: ["Night Market", "Pentagon Hostel"],
          description: "Fastest route through residential area",
        },
        {
          id: "3",
          algorithm: algorithm || "floyd",
          distance: 1.6,
          time: 10,
          landmarks: ["Great Hall", "Sports Complex"],
          description: "Scenic route with major landmarks",
        },
      ]
      setRoutes(mockRoutes)
      setIsLoading(false)
    }, 1500)
  }

  const getAlgorithmIcon = (alg: string) => {
    const algorithm = algorithms.find((a) => a.value === alg)
    return algorithm?.icon || Route
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Navigation className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-work-sans)] text-foreground">
                UG Campus Navigator
              </h1>
              <p className="text-muted-foreground">Find optimal routes across University of Ghana campus</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Route Planning Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-work-sans)]">Plan Your Route</CardTitle>
            <CardDescription>Enter your starting point and destination to find the best path</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="from"
                    placeholder="Enter starting location"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="to"
                    placeholder="Enter destination"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Route Through Landmark (Optional)</Label>
                <Select value={selectedLandmark} onValueChange={setSelectedLandmark}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a landmark" />
                  </SelectTrigger>
                  <SelectContent>
                    {landmarks.map((landmark) => (
                      <SelectItem key={landmark} value={landmark}>
                        {landmark}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    {algorithms.map((alg) => (
                      <SelectItem key={alg.value} value={alg.value}>
                        <div className="flex items-center gap-2">
                          <alg.icon className="h-4 w-4" />
                          {alg.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleFindRoutes} disabled={!fromLocation || !toLocation || isLoading} className="w-full">
              {isLoading ? "Finding Routes..." : "Find Routes"}
            </Button>
          </CardContent>
        </Card>

        {/* Route Results */}
        {routes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold font-[family-name:var(--font-work-sans)]">Route Options</h2>
            <div className="grid gap-4">
              {routes.map((route) => {
                const AlgorithmIcon = getAlgorithmIcon(route.algorithm)
                return (
                  <Card key={route.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent/10 rounded-lg">
                            <AlgorithmIcon className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold font-[family-name:var(--font-work-sans)]">
                              {route.algorithm.charAt(0).toUpperCase() + route.algorithm.slice(1)} Route
                            </h3>
                            <p className="text-sm text-muted-foreground">{route.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Map
                        </Button>
                      </div>

                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <Route className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{route.distance} km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{route.time} min</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Landmarks along route:</p>
                        <div className="flex flex-wrap gap-2">
                          {route.landmarks.map((landmark) => (
                            <Badge key={landmark} variant="secondary">
                              {landmark}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Algorithm Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-work-sans)]">Available Algorithms</CardTitle>
            <CardDescription>Choose the best pathfinding algorithm for your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {algorithms.map((alg) => (
                <div key={alg.value} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <alg.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold font-[family-name:var(--font-work-sans)]">{alg.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alg.value === "dijkstra" && "Finds shortest path considering all possible routes"}
                    {alg.value === "astar" && "Optimized search using heuristics for faster results"}
                    {alg.value === "floyd" && "Calculates shortest paths between all location pairs"}
                    {alg.value === "criticalpath" && "Identifies critical path for project scheduling"}
                    {alg.value === "routesearch" && "Advanced route search with multiple criteria"}
                    {alg.value === "transportation" && "Optimizes transportation and logistics problems"}
                    {alg.value === "mergesort" && "Efficient sorting for route optimization"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
