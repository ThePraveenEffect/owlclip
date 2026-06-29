# Tanstack Query Implementation.

Step 1. Install Tanstack query via preferable package manager.

```
pnpm add @tanstack/react-query
```

Step 2. Import it to the main.tsx or In Next js Layout.tsx or in main renderer of your app.

import {QueryClient} from "@tanstack/react-query"

const queryClient = new QueryClient(); 

and now most important wrap that query provider to the main renderer(<App/>) or <body> in next js. 

```
 <html >
    
    <QueryClientProvider          client={queryClient}>

      <body >

      {children}

      </body>

    </QueryClientProvider>

    </html>
```


how to use inside an App. 

const query = useQuery();

that useQuery takes one primary argument that is an Object. 

this Object needs two properties to work properly.

first property: queryKey - is Array.


TanStack Query treats the queryKey array like a unique ID or key in a giant JavaScript object cache.

used for refetching & caching the data.

queryKey always be unique.


second property:  queryfn - function to fetch. or run.

```
export function useAuth(){
    return  useQuery({
        queryKey:["me"],
        queryFn: getMe,
        select: (data) => data?.user,
        retry: false,

        staleTime: 1000*60*5,
    })
}
```













