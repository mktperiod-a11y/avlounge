# AV라운지

배우 랭킹, 배우 찾기, 전체 품번 목록과 개인 보관함을 한 흐름으로 연결한 성인 대상 정보성 메타데이터 사이트입니다.

- 공개 사이트: https://avlounge.injani279299.chatgpt.site
- GitHub 저장소: https://github.com/mktperiod-a11y/avlounge

## 주요 기능

- 배우명·일본어명·로마자명·품번 통합검색
- 기준을 분리한 배우 랭킹
- 배우별 전체 확인 품번과 페이지 이동
- 제작사 필터와 품번 정렬
- 배우·품번 브라우저 보관함
- 배우/품번별 케이디스크·온디스크 검색 연결
- 정보 정정 요청 UI
- PC·태블릿·모바일 반응형 레이아웃
- Creative Commons 사진 출처 표시

## 실행

Node.js 22.13 이상이 필요합니다.

```bash
npm ci
npm run dev
```

프로덕션 빌드는 다음 명령으로 확인할 수 있습니다.

```bash
npm run build
```

## 데이터 원칙

확인되지 않은 작품 제목이나 발매일은 임의로 만들지 않습니다. 품번은 제작사 공식 페이지와 공개 작품 색인을 기준으로 정리하며, 랭킹은 기준과 시점을 함께 표시합니다.

배우 사진은 Wikimedia Commons의 Creative Commons 자료를 WebP로 변환해 사용합니다. 저작자, 라이선스, 원본 링크는 사이트의 `데이터 출처` 화면과 `app/data.ts`에 기록되어 있습니다.

저장소에 포함된 이미지의 파일별 고지는 [ASSET-LICENSES.md](ASSET-LICENSES.md)에서 한 번에 확인할 수 있습니다.

## 기술 구성

- Vinext / Next.js
- React 19
- TypeScript
- Tailwind CSS 4 기반 글로벌 스타일
- 브라우저 `localStorage` 보관함

## 주요 디렉터리

- `app/`: 화면, 데이터, 전역 스타일
- `public/actors/`: 배우 이미지
- `scripts/`: 설치·빌드·검증 도구
- `tests/`: 렌더링 결과 검증
- `worker/`: Cloudflare Workers 진입점

## 전달 및 운영 참고

이 저장소는 현재 공개 배포에 사용된 소스 커밋을 전달용으로 복제한 것입니다. `.openai/hosting.json`은 기존 ChatGPT Sites 배포 설정을 나타내므로 다른 계정이나 별도 환경에서 배포할 때는 새 프로젝트 설정으로 교체해야 합니다.

별도의 `LICENSE` 파일이 없으므로 코드 사용·수정·재배포 범위는 저장소 소유자와 협의해야 합니다. 배우 이미지 재사용 시에는 `app/data.ts`에 기록된 원본 주소와 Creative Commons 라이선스 조건을 확인해야 합니다.
