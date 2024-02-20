---
title: vite 라이브러리 모드에서 Invalid hook call 오류 발생
tags:
- vite
- 트러블슈팅
---

## 문제 상황
vite library mode 로 빌드를 하던중 해당 패키지를 가져다가 사용하는 곳에서 invalid hook call 오류가 발생했다. 

```
react.development.js:209 Warning: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
printWarning @ react.development.js:209
react.development.js:1630

Uncaught TypeError: Cannot read properties of null (reading 'useRef')
```

## 해결 과정
해당 라이브러리 모드에서 사용하는 측에서 react, react-dom 는 이미 설치되어서 사용되기 때문에 peerDependencies 로 설정해주었다. 

```json
{
  "peerDependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
```

하지만 vite.config.ts 의 `rollupOptions.external` 에 해당 라이브러리를 추가해주지 않아서 react, react-dom 이 번들에 포함되었다. 

## 해결 방법

`rollupOptions.external` 에 react, react-dom 패키지를 명시해주어 번들에서 제외시켰다.

```typescript
//vite.config.ts
{
  build: {
    // …
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  }
}
```

## 참고 자료

- https://dev.to/receter/how-to-create-a-react-component-library-using-vites-library-mode-4lma
- https://ko.vitejs.dev/guide/build.html#library-mode
- https://github.com/vitejs/vite/issues/11069
