---
title: Next.js  
tags:
- React
- Nextjs
---

## Next.js 의 특이점

### 다양한 렌더링 기술

**Static Site Generation (SSG)**

**Server side Rendering (SSR)**

**Incremental Site Regeneration (ISR)**

### 퍼포먼스 측면 

**코드 스플릿팅**  
하나의 번들을 여러개의 파일로 나누어, 실제 로드에 필요한 번들 파일만 불러 올수 있도록 함

**이미지 옵티마이징**  
[Next/Image를 활용한 이미지 최적화](https://fe-developers.kakaoent.com/2022/220714-next-image/)  
[Image Component and Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

현재 기기의 해상도에 따라 이미지의 해상도를 다르게 로딩할 수 있음

[(작성중) Nextjs Image Optimization](nextjs-image-optimization.md)

## 파일 기반 라우팅  
pages 하위에 있는 파일들이 라우팅됨, 동적 라우팅을 사용할 수도 있음

### SEO

### Serverless Functions

AWS 의 람다 와 동일, Vercel 에서는 Serverless Functions 이라고 부름









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

## Next config

### base path 

sub-path 도메인으로 어플리케이션을 서빙하고 싶을때 basePath 옵션을 통해 sub-path 를 설정할 수 있다.

```js
module.exports = {
  basePath: '/new'
}
```

> nextjs 의 base path 설정으로 인해 `mockServiceWorker.js` 를 불러오지 못함

[관련 링크](https://github.com/mswjs/msw/issues/690#issuecomment-849552403)

```js
// next.config.js
module.exports = {
  basePath: '/prefix',
  async headers() {
    return [
      {
        // Append the "Service-Worker-Allowed" header
        // to each response, overriding the default worker's scope.
        source: '/(.*)',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },
}

// ...

worker.start({
  serviceWorker: {
    // Specify the worker script URL relative to the _root_.
    url: '/prefix/mockServiceWorker.js',
    options: {
      // Override the scope to the root ("/").
      // By default, the worker is scoped to its location on your server,
      // which in this case would be "/prefix".
      scope: '/',
    },
  },
})
```
















