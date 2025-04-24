---
title: Model Context Protocol
tags:
  - AI
---

## MCP(Model Context Protocol)란?

MCP는 애플리케이션이 LLM(Large Language Model)에 **외부 컨텍스트를 구조적이고 표준화된 방식으로 전달할 수 있도록 돕는 오픈 프로토콜**입니다.

기존에는 LLM에 특정 문맥이나 정보를 제공하기 위해 프롬프트에 직접 데이터를 삽입하거나 외부 애플리케이션이 컨텍스트를 정리해서 전달해야 했는데, 이 방식은 정적인 데이터나 한정된 컨텍스트에만 효과적이었습니다.

MCP는 이러한 한계를 극복하여 **모델이 필요한 문맥 정보를 외부 데이터 소스(로컬 또는 원격)에서 동적으로 가져올 수 있도록 설계**되었습니다.

> 기존: 개발자가 "이런 질문에는 이 데이터를 줘야지"라고 판단해 **정적인 컨텍스트를 프롬프트에 주입**  
> MCP: 모델이 질문의 성격에 따라 "이런 데이터가 필요하구나"라고 판단해 **직접 외부 컨텍스트를 요청**

## MCP의 기본 구조
![CleanShot 2025-03-31 at 16.29.06@2x-20250331-072911.png](../attachments/CleanShot%202025-03-31%20at%2016.29.06%402x-20250331-072911.png)

### MCP 호스트 (MCP Host)
- **LLM을 포함한 메인 애플리케이션**으로, 사용자 요청 처리 및 응답 생성
- Claude Desktop, IDE 플러그인, 대화형 AI 도구 등이 해당
- 모델이 외부 컨텍스트가 필요하다고 판단하면 MCP 클라이언트를 통해 데이터 요청
- 사용자 중심의 UI/UX 레이어 역할

### MCP 클라이언트 (MCP Client)
- **MCP 호스트와 MCP 서버 사이의 중간 다리 역할**
- 모델의 외부 정보 요청을 MCP 서버로 전달하고 결과를 모델로 반환
- 일반적으로 호스트 내부에 내장되지만, 별도 프로세스로 분리 가능
- MCP 서버와 1:1 연결 유지
- 프로토콜 처리, 인증 관리, 요청 포맷 변환 등 역할 수행

### MCP 서버 (MCP Server)
- 클라이언트로부터 요청을 받아 **데이터를 조회하고 가공하여 응답하는 경량 서버**
- MCP 프로토콜에 따라 요청 수신, 로컬/원격 데이터 소스에서 정보 획득
- 데이터 가공, 필터링 로직 내장 가능
- 다양한 데이터 소스(파일, DB, API 등) 처리 가능

### 데이터 소스
1. **로컬 데이터 소스**: 파일, 데이터베이스, 실행 중인 애플리케이션 등
2. **원격 서비스**: GitHub, Notion, Jira, Slack, RESTful API 등

## MCP 연결 방법 (Claude Desktop 예시)

1. **필수 조건**
    - Claude Desktop 설치
    - Node.js 설치

2. **설정 파일에 MCP 서버 추가**
    - claude_desktop_config.json 수정
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-filesystem",
           "/Users/yourname/Desktop",
           "/Users/yourname/Downloads"
         ]
       }
     }
   }
   ```

3. **Claude 재시작**
    - 재시작 후 우측 하단에 망치 아이콘이 보이면 MCP 서버 정상 연결

## MCP 오픈소스 서버 모음
- https://github.com/punkpeye/awesome-mcp-servers

## 실제 사용 사례

1. **순차적 사고를 통한 문제 해결**
    - https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking

2. **Figma MCP를 통한 컴포넌트 구현**
    - https://github.com/GLips/Figma-Context-MCP

3. **Jira, Confluence로 티켓, 문서 내용 가져오기**
    - https://github.com/sooperset/mcp-atlassian

4. **프론트엔드 E2E 테스트 작성**
    - https://github.com/executeautomation/mcp-playwright

5. **브라우저 최적화**
    - https://github.com/AgentDeskAI/browser-tools-mcp
