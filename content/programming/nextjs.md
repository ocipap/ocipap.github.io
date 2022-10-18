---
title: Next.js
tags:
  - React
---

## 동적 임포트 (Dynamic Import)

`next/dynamic` 을 통해서 동적 임포트를 지원

### Example

```tsx
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../components/header'), {
  suspense: true,
})

export default function Home() {
  return (
    <Suspense fallback={`Loading...`}>
      <DynamicHeader />
    </Suspense>
  )
}
```

### Suspense

suspense 옵션을 통해서 `Suspense` 기능을 사용

```tsx
const DynamicHeader = dynamic(() => import('../components/header'), {
  suspense: true, // 
})
```

React 18 이전에는 suspense 대신 loading 옵션을 사용

```tsx
const DynamicHeader = dynamic(() => import('../components/header'), {
  loading: () => <div>Loading...</div>,
})
```

### named export

동적 임포트하는 파일의 특정 컴포넌트를 import 하고 싶다면 Promise then 을 사용

```tsx
// components/hello.js
export function Hello() {
  return <p>Hello!</p>
}

// pages/index.js
const DynamicComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

### Client Side Rendering
동적 임포트를하는 컴포넌트를 CSR 방식으로 사용하고 싶다면 ssr 옵션을 false 로 주면 된다.


```tsx
import dynamic from 'next/dynamic'

const DynamicHeader = dynamic(() => import('../components/header'), {
  ssr: false,
})
```







