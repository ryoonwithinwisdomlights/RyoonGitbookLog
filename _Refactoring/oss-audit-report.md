# OSS 준비 점검 보고서 (내부용 / 커밋 제외)

> 이 파일은 `_Refactoring/` 아래에 위치하며, 현재 `.gitignore`에 의해 **git에 커밋되지 않도록** 설계되었습니다.

## 범위

- 오픈소스 블로그 프레임워크로 발전하기 위한 “레포 위생/재현성/정책/CI/환경설정” 점검
- 코드 기능 변경보다는 **프로젝트 운영/배포/기여** 관점의 개선사항 중심

## 핵심 결론 (요약)

- **문서/정책/CI가 비어 있음**: README, 기여 가이드, 보안 정책, 이슈/PR 템플릿, CI 워크플로우가 없음
- **문서 디렉토리(`docs`)가 현재 gitignore**: 문서를 쌓아도 추적되지 않는 구조
- **도구/버전 정합성 리스크**:
  - `react@19` vs `@types/react@18` 불일치
  - `next@15`인데 `eslint-config-next@13`, `eslint@7` 등 레거시 조합
  - `.eslintrc.js`는 `@typescript-eslint/*`, `eslint-plugin-prettier`, `eslint-plugin-tailwindcss`를 전제로 하나 의존성이 불완전할 수 있음
- **패키지 매니저/락파일 정책이 모호**: pnpm 기반인데 npm/yarn 흔적이 일부 존재할 수 있음
- **환경변수 문서화 필요**: `process.env.*` 사용이 많아 `.env.example` + 표 형태 문서가 반드시 필요

## 발견 사항 (상세)

### 1) 문서/정책/CI

- `README*` 없음
- `CONTRIBUTING*` 없음
- `CODE_OF_CONDUCT*` 없음
- `SECURITY*` 없음
- `.github/` 없음 (워크플로우/템플릿 부재)

### 2) Git ignore 정책

- `.gitignore`에 `/docs`가 포함되어 문서가 추적되지 않음
- `.gitignore`에 `package-lock.json` 무시 규칙 존재 (pnpm 중심으로 가려는 의도는 보임)

### 3) 패키지/도구 정합성

- `react@19` + `@types/react@18`은 타입 충돌/경고 요인이 될 수 있음
- `next@15` 환경에서 `eslint-config-next@13`, `eslint@7` 조합은 설치/린트 재현성을 떨어뜨릴 수 있음
- `.eslintrc.js` 구성(typescript-eslint, prettier, tailwindcss rule)과 실제 devDependency 구성이 일치해야 함

### 4) 환경변수/배포

- `blog.config.ts`에서 `process.env.NEXT_PUBLIC_*` 및 `process.env.NOTION_DATABASE_ID` 등 다양한 변수를 참조
- 공개 OSS로 배포할 경우, **환경변수 목록과 최소 설정**이 README에 핵심으로 들어가야 함

## 권장 실행 플랜 (README 작성 전)

1) **docs 정책 결정**
   - 권장: `/docs`를 git 추적 대상으로 전환( `.gitignore`에서 `/docs` 제거)
2) **패키지 매니저 고정**
   - 권장: pnpm 단일 정책 + `packageManager` 필드 추가 + CI도 pnpm으로 고정
3) **React/Next/ESLint 정합성 정리**
   - `eslint-config-next`를 next 버전에 맞춤
   - `eslint`/`@typescript-eslint/*`/필요 plugin 설치 및 구성 정합화
   - `@types/react`를 React 메이저에 맞추거나 제거(React 19 정책 결정)
4) **`.env.example` + CI 추가**
   - `.env.example`에 필요한 env 목록/설명 추가
   - GitHub Actions로 `pnpm install --frozen-lockfile` + `pnpm build` + (가능하면) `pnpm prettier:check` + `pnpm lint`
   - 이슈/PR 템플릿, 보안 정책, 기여 가이드 추가
5) **README 작성**
   - “초기 설치 → env 설정 → 로컬 실행 → 배포(Vercel 등)”이 한 번에 성공하는 흐름으로 구성

