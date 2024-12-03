declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL: string
      NODE_ENV: 'development' | 'production' | 'test'
      NEXT_PUBLIC_API_URL: string
      // Add other environment variables here
    }
  }