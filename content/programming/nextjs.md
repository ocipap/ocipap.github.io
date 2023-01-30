---
title: Next.js  
tags:
- React
- Nextjs
---

## 데이터 패칭 및 렌더링

### Server side Rendering (SSR)  
서버에서 데이터 패칭 후 페이지를 그려줌
새로고침마다 데이터를 가져옴

### Static Site Generation (SSG)
정적인 사이트 생성  
getStaticProps (getStaticPaths) 를 통해 데이터를 Fetch 해옴  
빌드 과정에 데이터를 Fetch 해서 페이지를 생성  

`yarn dev` 명령에서는 SSR 과 동일하게 동작하고, `yarn build`, `yarn start` 에서는 SSG 가 정상 동작  

`getStaticPaths` 는 동적 path 에서 getStaticProps 로 만들어질 데이터가 무엇인지 알려줌

### **Incremental Site Regeneration (ISR)**

SSG 와 비슷하게 동작, revalidate 옵션으로 페이지를 다시 만들어낼 주기를 설정

```tsx
export async function getStaticProps() {
  return {
    props: { time: new Date().toISOString() },
    revalidate: 10,
  }
}
```
10 초에 한 번씩 페이지를 새로 만들어냄

### Pre-rendering
getServerSideProps / getStaticProps 에서 데이터를 미리 만들어 놓고 내려주는 방식
따라서 페이지 렌더링 후 js 를 로드하여 데이터를 가져오는 CSR 방식에 비해, SEO 에 유리함
---

## 최적화

### 코드 스플릿팅  
하나의 번들을 여러개의 파일로 나누어, 실제 로드에 필요한 번들 파일만 불러 올수 있도록 함

### 이미지 옵티마이징
[Next/Image를 활용한 이미지 최적화](https://fe-developers.kakaoent.com/2022/220714-next-image/)  
[Image Component and Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

현재 기기의 해상도에 따라 이미지의 해상도를 다르게 로딩할 수 있음

### 파일 기반 라우팅  
pages 하위에 있는 파일들이 라우팅됨, 동적 라우팅을 사용할 수도 있음

### SEO
...

### Serverless Functions
AWS 의 람다 와 동일, Vercel 에서는 Serverless Functions 이라고 부름

---

## 동적 임포트 (Dynamic Import)
`next/dynamic` 을 통해서 동적 임포트를 지원

**Example**

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
--- 
## Shallow Routing
getServerSideProps / getStaticProps 를 실행시키지 않고,
현재 상태를 잃지 않고 url 를 변경할 수 있음

Shallow Routing 은 **현재 페이지 URL 변경에서만 작동**  

### url 을 변경시키는 3가지 방법

1. location.replace("url"): 로컬 state 유지 안됨 (리렌더)
2. router.push(url): state 유지 / data fetching O
3. router.push(url, as, { shallow: true }): state 유지 / data fetching X




