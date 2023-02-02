---
title: Next.js  
tags:
- React
- Nextjs
---

## Data Fetching

### getInitialProps  
server side rendering 

### getServerSideProps
server side rendering

### getStaticPath
Dynamic routes 를 할 때 path 리스트를 생성

#### fallback 
빌드 과정에 존재하지 않았던 static 파일에 대한 처리 옵션

존재하지 않는 static 파일 접속 시, 
- false 인 경우(default), 404 에러 발생
- true 인 경우, 해당 페이지의 getStaticProps 를 실행하여 데이터를 가져온 후 static file 을 생성함
  - 이때 router 의 isFallback 을 true 로 변환 후 페이지 렌더링
```tsx
import { useRouter } from 'next/router'

function Post({ post }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }
}
```
- 'blocking' 인 경우, 해당 해당 페이지의 getStaticProps 를 실행하여 데이터를 가져온 후 static file 을 생성함
  - getStaticProps 의 응답을 기다린 후 페이지 렌더링

상위 1 ~ 50 개의 페이지를 빌드 과정에 미리 생성하고, 나머지는 fallback 을 통해 요청 당시에 생성하는 방식을 사용하면 좀 더 효율적으로 앱을 운용할 수 있음

### getStaticProps
SSG  

---

## Rendering

### Server side Rendering (SSR)  
서버에서 데이터 패칭 후 페이지를 그려줌
새로고침마다 데이터를 가져옴

### Static Site Generation (SSG)
정적인 사이트 생성  
getStaticProps (getStaticPaths) 를 통해 데이터를 Fetch 해옴  
빌드 과정에 데이터를 Fetch 해서 페이지를 생성  

`yarn dev` 명령에서는 SSR 과 동일하게 동작하고, `yarn build`, `yarn start` 에서는 SSG 가 정상 동작  

`getStaticPaths` 는 동적 path 에서 getStaticProps 로 만들어질 데이터가 무엇인지 알려줌

### Incremental Site Regeneration (ISR)

SSG 와 비슷하게 동작, revalidate 옵션으로 페이지를 다시 만들어낼 주기를 설정

```js
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

```js
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

```js
const DynamicHeader = dynamic(() => import('../components/header'), {
  suspense: true, // 
})
```

React 18 이전에는 suspense 대신 loading 옵션을 사용

```js
const DynamicHeader = dynamic(() => import('../components/header'), {
  loading: () => <div>Loading...</div>,
})
```

### named export

동적 임포트하는 파일의 특정 컴포넌트를 import 하고 싶다면 Promise then 을 사용

```js
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


```js
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

---

## Link Component
클라이언트 단에서 페이지 이동을 할 때 사용하는 컴포넌트

```jsx
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
    </ul>
  )
}

export default Home;
```
Link 컴포넌트에 스타일을 주고 싶다면, Link 컴포넌트 안에 a 태그를 넣어주고 해당 a 태그에 스타일을 적용하면 된다.

### Link 컴포넌트의 자식으로 a 태그 커스텀 컴포넌트를 사용한 경우

passHref 옵션을 사용해야한다. 해당 속성을 넣지 않으면 a 태그에 href 속성이 없어 SEO 에 안좋다.

```js
const StyledLink = styled.a`
  color: red;
`

function Home() {
  return (
    <ul>
      <li>
        <Link href="/" passHref>
          <StyledLink>링크</StyledLink>
        </Link>
      <li>
    </ul>
  )
}
```

### Link 컴포넌트의 자식으로 함수형 컴포넌트를 사용한 경우
해당 함수형 컴포넌트는 forwardRef 를 사용해야한다.  

### Link 컴포넌트에 적용된 최적화

**Client side navigate**  
기존 a 태그와 다른 점은 페이지를 이동할 때 필요한 리소스만 호출해서 JS 상에서 페이지를 이동시킨다.  
따라서 해당 페이지내 리소스가 아닌 외부 링크로 가는 경우에는 a 태그를 사용해도 무방함  

**Prefetching**  
Link 컴포넌트가 viewport 에 들어오면 해당 페이지의 리소스를 미리 불러온다.   
`yarn start` 에서만 동작  

## Image 컴포넌트

### Image 컴포넌트에 적용된 최적화

**Resizing**  
기기의 크기에 맞게 이미지 리소스를 리사이징  
모바일 환경에서 이미지 리소스 크기를 줄여줌

**Lazy loading**
viewport 에 해당 컴포넌트가 노출되었을 때 이미지를 불러옴  
화면에 노출되지 않은 이미지 리소스를 불러오지 않아 유리함  

## Code Splitting
애플리케이션의 번들을 각 진입점에 필요한 더 작은 청크로 분활하는 프로세스
특정 페이지를 실행하는 데 필요한 코드만 로드하여 애플리케이션의 초기 로드 시간을 개선
