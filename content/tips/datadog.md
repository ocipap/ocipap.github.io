---
title: Datadog 정리
tags:
  - tip
  - datadog
  - monitoring
---

## Product Analytics

### [Pathways Diagrams](https://docs.datadoghq.com/ko/product_analytics/charts/pathways/)

사용자의 여정을 시각화하여 경로를 분석할 수 있음

> pageview 이벤트만 지원하고 사용자 행동 이벤트 (click) 은 지원하지 않음

지정한 key view 를 기준으로 
- 방문 전 step 
- 방문 후 step  
을 확인할 수 있다.

  
#### 💡 인사이트

- 구매 완료 페이지까지의 여정
- 신규로 만든 멘토링 상세 페이지를 방문 전/후로 해서 
  - 해당 페이지를 기준으로 어떤 페이지까지 이동하는지 
  - 해당 페이지까지 도달하기위해 어떤 페이지를 거쳐오는지 
  - 리액트로 미전환한 페이지는 어떤 경로를 통해서 들어오는지 알 수 없음


### [Users & Segments](https://docs.datadoghq.com/ko/product_analytics/segmentation/)

유저를 특정 조건으로 나누는 기능

Exteral Data 를 사용해서 다른 유저 데이터셋을 기반으로도 필터링할 수 있음

- OB, NB 
  - 유저 ID 10000 아래 필터 ← 가능한지 확인
- 특정 국가 선택
- B2B 유저, 일반 유저
