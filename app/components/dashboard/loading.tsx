import { Card, CardContent, CardHeader } from "../ui/card"

export function MetricsGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ActivitySkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ActionsSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="mt-1 h-4 w-96 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>

        {/* Metrics Grid skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded"></div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
            <CardHeader>
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded"></div>
            </CardContent>
          </Card>
        </div>

        {/* Activity skeleton */}
        <Card className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50">
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}