---
title: 실무에서 배운 CSS 팁
tags:
  - css
---

### safari 에서 input disabled 색상이 안보이는 경우

```css
-webkit-text-fill-color: #880000; // 원하는 색상
opacity: 1; /* required on iOS */
```

### flex gap 대신 사용할 수 있는 선택자

일부 브라우져에서는 flex 의 gap 속성이 되지 않는다.

```css
// before
.box {
	display: flex;
	gap: 0 30px
}
```

```css
// after 
.box {
	display: flex;
}

.box > * + * {
	margin-left: 30px;
}
```

올빼미 연산자라고 부르는 거 같다.

[https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/)