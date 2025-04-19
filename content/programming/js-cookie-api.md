---
title: js-cookie 라이브러리 apis
tags:
  - library
---

```javascript
const Cookies = _Cookies.withAttributes({ 
  path: '/', 
  domain: COOKIE_DOMAIN 
}).withConverter({ 
  write: function (value) { 
    return encodeURIComponent(value); 
  }
});
```

## 1. 도메인 설정
```
withAttributes({ path: '/', domain: COOKIE_DOMAIN })
```

- `path: '/'`: 쿠키가 전체 도메인에 유효하도록 설정. 경로를 제한하지 않고 사이트 전체에서 쿠키에 접근할 수 있음.
- `domain: COOKIE_DOMAIN`: 특정 도메인에서만 쿠키가 유효하도록 설정. 여기서 `COOKIE_DOMAIN`은 상수로, 예를 들어 `.example.com`과 같은 값일 것입니다. 앞에 점(.)을 붙이면 모든 서브도메인(app.example.com, api.example.com 등)에서도 쿠키에 접근할 수 있음

## 2. 인코딩 설정
```
withConverter({ write: function (value) { return encodeURIComponent(value); } })
```

- 쿠키 값을 저장할 때 자동으로 `encodeURIComponent`를 사용해 인코딩
- 이 설정은 한글, 특수문자, 공백 등이 포함된 값을 안전하게 저장
- 인코딩이 없으면 쿠키값에 세미콜론, 쉼표 등의 특수문자가 있을 때 문제가 발생할 수 있음.
