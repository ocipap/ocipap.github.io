---
title: 수요코딩회 ep.1 정리
tags:
  - 수요코딩회
---

## Promise.race 를 언제 사용할까?  
`Promise.race` 는 배열안에 있는 promise 중에 하나라도 resolve 될때, 해당 resolve 된 값을 반환한다.  

사용 예시)  
- 타임아웃 처리  
응답이 오래걸리는 Promise 와 delay 를 Promise 배열에 넘겨줘서 지정한 시간 이내에 resolve 가 되지 않으면 타임아웃 처리를 할 수 있다. 

## Promise.all 은 언제 사용할까?

`Promise.all` 은 배열안에 있는 모든 promise 가 resolve 될때, 해당 resolve 된 값을 배열로 반환한다.


