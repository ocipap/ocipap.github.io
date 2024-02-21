---
title: shaka player using typescript
tags:
- library
- shaka-player
---

## 문제 상황
현재 사내에서 사용하는 라이브러리 중에 javascript media 라이브러리인 [shaka-player](https://github.com/shaka-project/shaka-player) 를 사용하고 있다.
해당 라이브러리를 사용하는 프로젝트는 typescript 로 작성되어 있기 때문에, shaka-player 를 typescript 로 사용하기 위한 방법을 찾아보았다.

## 해결 과정

관련한 이슈가 github 에 올라와 있다.
https://github.com/shaka-project/shaka-player/issues/1030

> We looked into switching over to Typescript before, but decided to stick with Closure. I'll have to consult with Joey about adding Typescript support. If we have to maintain declarations files in addition to our existing externs, it'll probably add a lot of maintenance, so we'll see.

shaka 내부 구현이 Closure 로 되어 있기때문에 typescript 도입에 대한 이슈가 있는것 같다.

## 해결 방법

아라에 custom type declaration 을 추가하는 방법이 나와있어서 해당 방법을 사용했다.

```typescript
// @types/shaka-player/index.d.ts

declare module 'shaka-player' {
  export = shaka;
}

declare module 'shaka-player/dist/shaka-player.compiled' {
  export = shaka;
}
```

## 미해결 난제
tsup 을 통해서 해당 shaka-player 를 포함하고 있는 파일을 빌드하려고 했으나, --dts 옵션을 사용하면 해당 라이브러리의 type declaration 이 빌드되지 않는다.
```sh
tsup src --dts
```

해당 이슈에 대한 해결 방법을 찾아보고 있다.
```sh
Error: namespace child (hoisting) not supported yet

  1 | declare module 'shaka-player' {
> 2 |   export = shaka;
    |   ^^^^^^^^^^^^^^^
  3 | }
```

일단 vite 라이브러리 모드를 사용하도록 하자.

## 참고 자료
- https://github.com/egoist/tsup/discussions/870
- https://github.com/shaka-project/shaka-player
- https://github.com/shaka-project/shaka-player/issues/1030#issuecomment-881283681

