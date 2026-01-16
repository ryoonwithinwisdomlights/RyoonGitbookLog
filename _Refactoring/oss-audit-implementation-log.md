# OSS 점검 → 적용 로그 (내부용 / 커밋 제외)

> 기준 문서: `_Refactoring/oss-audit-report.md`  
> 목적: “(1) 작업한 것 / (2) 필요하다고 주장한 것 / (3) 그에 따라 적용한 것”을 한 눈에 추적하기 위한 실행 로그

---

## 1) 작업한 것 (발생 이슈/대응 작업)

### A. 런타임/빌드 이슈로 인한 리팩토링(사용자 진행)

- 대화 중 언급된 “노드범위에러” 이슈로 인해 별도의 대규모 리팩토링을 진행했고,
  그 결과가 현재 브랜치에 반영된 상태로 보입니다.

### B. OSS 프레임워크화(README 작성 전 준비) 작업

아래 항목들은 “오픈소스 프로젝트로 발전하기 위한 기본 운영 세트”를 갖추는 목적의 작업입니다.

- **문서/정책/템플릿/CI 추가**
  - `.github/workflows/ci.yml`
  - `.github/pull_request_template.md`
  - `.github/ISSUE_TEMPLATE/*`
  - `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
  - `env.example`
  - `docs/*` (예: `docs/blog-config-pruned.md`)
- **패키지 매니저 정책 정리**
  - `package.json`에 `packageManager` 지정(pnpm 고정)
  - `pnpm-lock.yaml` 기준으로 설치/빌드가 재현되도록 방향 정리
- **도구/버전 정합성(설치 재현성)**
  - Next/ESLint/TypeScript/React types 정합성 맞춤
  - 기존 코드베이스 특성상 CI를 완전히 막는 rule은 완화하고, 경고(warn)는 남기는 방향으로 운영 안정성 확보
- **Next workspace root 오탐 방지**
  - `next.config.ts`에 `outputFileTracingRoot` 추가(외부 lockfile 때문에 root를 잘못 잡는 케이스 대응)

---

## 2) 필요하다고 주장한 것 (점검 보고서의 “요구사항”)

`_Refactoring/oss-audit-report.md`의 결론을 실행 가능한 요구사항으로 재진술하면:

1. **docs 정책 결정**: 문서는 버전관리 대상이어야 함
2. **패키지 매니저 고정 + lockfile 정책 확정**: 설치/빌드 재현성을 확보해야 함
3. **React/Next/ESLint 정합성 정리**: “설치만 하면 돌아가는” 상태가 되어야 함
4. **환경변수 표준화 + CI**: `.env 예시` + GitHub Actions로 기본 품질 게이트 구축
5. **README는 마지막**: 위가 갖춰져야 README가 “한 번에 성공” 가이드가 됨

---

## 3) 그에 따라 적용한 것 (변경 결과/산출물)

### A. 커밋/히스토리 관점

최근 커밋 로그 기준으로(예: `9f96e4a`, `aa64728`, `f4ca110` 등), “README 직전 정리” 성격의 변경이 **여러 커밋으로 나뉘어 존재**합니다.

- 권장 merge 전략(레포 히스토리 깔끔하게 유지):
  - **GitHub에서 Squash merge** (권장)
  - 또는 로컬에서 squash rebase 후 push(히스토리 재작성/force push 필요할 수 있어, 명시적으로 요청될 때만 수행)

### B. 파일/기능 단위 적용 내역

- **docs 정책**
  - `/docs` 디렉토리가 gitignore에 의해 누락되지 않도록 정책 정리됨
  - 문서 산출물 예: `docs/blog-config-pruned.md`
- **CI/템플릿/정책**
  - `.github/workflows/ci.yml`
  - `.github/ISSUE_TEMPLATE/*`
  - `.github/pull_request_template.md`
  - `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
- **환경변수 예시**
  - `env.example` 추가
- **pnpm 고정**
  - `package.json`의 `"packageManager": "pnpm@..."`를 통해 팀/CI에서 pnpm 사용을 고정
- **Next root 오탐 방지**
  - `next.config.ts`의 `outputFileTracingRoot` 적용

---

## (참고) README 작성 전 체크리스트(현 상태 기준)

- [ ] `pnpm install`
- [ ] `pnpm build`
- [ ] `pnpm lint` (경고는 허용, CI fail은 없어야 함)
- [ ] `env.example` → `.env.local` 복사 후 최소 env로 로컬 실행 성공
- [ ] 배포 대상이 Vercel이면: cron/환경변수/standalone 동작 확인

