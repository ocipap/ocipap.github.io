---
title: 조성륜 이력서
tags:
  - 이력서
---

# 자기소개.

안녕하세요. 저는 3년차(만 4년) 프론트엔드 개발자 **조성륜(PAPICO)** 입니다.  

- 이메일: ocipap0531@gmail.com
- Github: https://github.com/ocipap
- 위키: https://ocipap.github.io/
- 블로그 (위키로 이전): https://pa-pico.tistory.com/

# Work Experience.

## INFLAB (2019.08. ~ 현재)

### 인프런 학습페이지 개선
현재의 인프런 학습페이지를 React 기반의 모던 스펙으로 마이그레이션하는 개선을 진행하였습니다.  

**홈페이지 주소**
https://www.inflearn.com/


**사용 기술**
Shaka player, React, Typescript, redux, react-query, react-hook-form, react-testing-library, vite  

**주요 내용**
- react-hook-form 의 Controller 컴포넌트를 사용하여, 기존 시스템 컴포넌트를 hook form 컴포넌트로 다룰 수 있게 해줌
- react-query 를 통해 api 통신 상태를 관리
- Shaka player 을 통해, 동영상 콘텐츠 제공
  - 커스텀 컨트롤러 추가 (모바일 컴포넌트)


### 랠릿  
IT 채용 플랫폼 랠릿 서비스의 어드민 페이지를 개발하였습니다.  

**홈페이지 주소**  
https://www.rallit.com/en      

**사용 기술**
React, Typescript, redux, redux-toolkit, redux-saga, Ant design  

**주요 내용**

- redux-saga 와 redux-toolkit 의 구조를 고도화하여, 최대한 코드의 중복을 제거  
- 비동기 로직을 상태로서 다루어, 컴포넌트에서 상태의 변화 기반으로 로직을 실행하는 선언적프로그래밍 도입  
- 비즈니스 서비스 (B2B)와 사용자 서비스 (B2C) 에서 공통으로 사용하는 로직을 모노레포로 구성하여 재활용  


### SEO 최적화
<strong style="color: skyblue;">As is</strong>  
페이지의 title 과 description 이 규칙이 없이 무분별하게 삽입되는 것을 개선하기 위해,  
html head 태그를 만들어내는 로직을 고도화 시켜, 페이지의 title, description 에 규칙을 부여했습니다.  
추가적으로 유용한 상품 관련 meta 데이터 추가와 페이지 url 별로 사이트맵을 생성하는 로직을 추가하였습니다.

<strong style="color: skyblue;">To Be</strong>  
그 결과 `[특정 기술] + 온라인 강의` or `[특정 기술] + 강의` 라는 검색어를 구글에 검색했을때 광고를 제외한 검색 결과에서 최상단에 위치할 수 있었습니다. 


### Google Tag Manager 도입
<strong style="color: skyblue;">As is</strong>  
프론트엔드 서비스 로직에 광고 스크립트가 **무분별하게 삽입**되는 것을 개선하기 위해,  
각각의 퍼널에 맞춤이벤트를 설정하고, **모든 광고 스크립트를 Google Tag Manager 로 이전**했습니다.  
퍼널 별로 유의미한 데이터를 함께 보내, 광고 스크립트에서 변수로써 활욜할 수 있도록 개선했습니다.  

<strong style="color: skyblue;">To Be</strong>  
**그 결과 광고스크립트 삽입 요청이 서비스 코드의 배포없이 진행될 수 있었습니다.**  

### A/B 테스트 도입
Hackle 이라고 하는 A/B 테스트 플랫폼 을 도입하여, **A/B 테스트가 가능한 운영 환경**을 구성하였습니다.  
위 작업을 통해 **A/B 테스트의 기본 원리** 를 알게되었고,  
**데이터를 기반으로 하는 개선 작업**을 진행할 수 있게 되어, 의사 선택하는 것에 도움이 되었습니다.  

### 인프런 기능 고도화
과거 워드프레스로 되어 있는 기능을 자체 코드로 마이그레이션 및 고도화를 진행하였습니다.    
사용한 기술은 Node.js, Vanilla javascript 를 베이스로 Server Side Rendering 으로 개발하였습니다.    
현재의 인프런이라는 서비스를 존재하게 해주는 프로젝트로 그때 그 당시의 익숙한 기술 선택하여 빠르게 개발하였습니다.  

- 쿠폰: 인프런 사이트 내부에서 사용되는 쿠폰 및 수강코드 기능 추가
- 비즈니스 서비스: B2B 서비스 기능 추가
- 학습페이지: 수업 영상을 시청하는 학습페이지 기능 개선
- 사이트 내 알림: 사이트 내 활동에 관한 알림 기능 추가
- 수강 노트: 영상 학습 중간 메모를 추가하는 기능 추가
- 멘토링 서비스: 멘토링 중개 기능 추가
- 강의 소개 페이지: 강의 상품을 소개하는 페이지 기능 및 UX 개선

# Other Experiences.

## 네이버커넥트재단 부스트캠프 웹 6기 리뷰어
부스트 캠프 웹, 모바일 6기 리뷰어로 참여하여, 팀별 코드 리뷰 및 가이드 진행

**홈페이지**  
https://boostcamp.connect.or.kr/

## 코드스쿼드 멤버스 프로젝트 리뷰어
코드스쿼드 멤버스 프로젝트 리뷰어로 참여하여, 팀별 코드 리뷰 및 가이드 진행

**홈페이지**  
https://codesquad.kr/


## 인프런 상시 멘토링 진행
인프런 페이지의 이력서 및 커리어 멘토링을 상시 진행하였습니다.  
현재 총 19건의 멘토링을 진행하였습니다.

## 설리번 프로젝트
고등학생들을 대상으로 한 웹 프론트엔드 멘토링을 진행하였습니다.

**홈페이지**  
https://slvn.page.link/-LT14Za2B638t9DAv0R-


## 코드스쿼드 미니 컨퍼런스 발표 - 개발만 잘하면 되는 줄 알았어요.
"개발만 잘하면 되는 줄 알았어요." 라는 주제로 개발자가 개발 외적으로 작용하는 일을 되게하는 방법에 대해 발표하였습니다.  

**관련 내용**  
[[i-just-needed-to-develop-it-well|개발만 잘하면 되는 줄 알았어요.]]

## Inflab 심야 FE 발표 - 랠릿은 어떻게 만들어졌을까?  
인프랩에서 주최한 심야 FE 컨퍼런스에서 "랠릿은 어떻게 만들어졌을까?" 라는 주제로 랠릿을 개발하면서 발생했던 문제점과, 해결 방법, 그리고 방지책을 이야기했습니다.
