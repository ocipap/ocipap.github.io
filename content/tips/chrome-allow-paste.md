---
title: Warning Don’t paste code into the DevTools Console that you don’t understand or haven’t reviewed yourself. This could allow attackers to steal your identity or take control of your computer. Please type ‘allow pasting’ below to allow pasting.
tags:
  - devtools
---

## 문제 상황
chrome 개발자 도구의 `[Console]` 탭에 코드를 붙어넣기 하려고 하면 아래와 같은 경고창이 뜬다.

```shell
Warning: Don’t paste code into the DevTools Console that you don’t understand or haven’t reviewed yourself. This could allow attackers to steal your identity or take control of your computer. Please type ‘allow pasting’ below to allow pasting.
```

## 해결 방법
해당 `[Console]` 창에 `allow pasting` 을 입력하면 붙여넣기가 가능하다.
