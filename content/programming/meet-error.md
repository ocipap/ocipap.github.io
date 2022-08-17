---
title: 내가 만난 에러
tags:
  - error
---

## The pseudo class ":first-child" is potentially unsafe when doing server-side rendering. Try changing it to ":first-of-type".

리액트 프로젝트를 실행시킬 때 console.error 로 해당 에러가 발생하였다.

원인은 SSR 을 하게될 시에 style element 도 함께 렌더링이 되는데, 이떄 `:first-child` 가 style element 가 될 수도 있어서 보여주는 경고이다.

참고 링크: https://github.com/emotion-js/emotion/issues/1059#issuecomment-444566635

