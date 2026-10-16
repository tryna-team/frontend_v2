## 🛠️ 개발 환경

Tryna는 **React Native + Expo + TypeScript** 기반 모바일 애플리케이션입니다.

| 항목 | 기술 및 도구 |
| --- | --- |
| Framework | React Native / Expo SDK 56 |
| Language | TypeScript |
| Styling | React Native StyleSheet |
| Routing | Expo Router |
| Icons | lucide-react-native |
| Package Manager | npm |
| Development | Expo Go / Android Development Build |
| Build | EAS Build (iOS 출시 예정) |

> 정확한 라이브러리 버전은 `package.json`과 `package-lock.json`을 기준으로 관리합니다.

### 1. 사전 준비

- **Node.js**: 프로젝트에서 지정한 버전 설치
- **npm**: Node.js와 함께 설치
- **Git**: 저장소 관리
- **VSCode**: 권장 개발 에디터
- **Expo Go**: 모바일 기기에서 앱 실행 및 테스트

설치 확인:

```bash
node -v
npm -v
git --version
```

### 2. 프로젝트 설치

**최초 참여 시**

```bash
git clone https://github.com/tryna-team/frontend_v2.git
cd frontend_v2
npm ci
```

**최신 코드를 받아올 경우**

현재 작업 중인 브랜치에서 최신 변경 사항을 가져옵니다.

```bash
git pull origin <브랜치명>
npm ci
```

`npm ci`는 `package-lock.json`을 기준으로 의존성을 설치합니다.

- 팀원 간 동일한 의존성 버전 유지
- 기존 `node_modules`를 정리한 후 재설치
- `package-lock.json`을 임의로 변경하지 않음

### 3. 개발 서버 실행

```bash
npx expo start --go
```

실행 후 모바일 기기의 Expo Go 앱에서 QR 코드를 스캔합니다.

- PC와 모바일 기기는 동일한 네트워크 사용 권장
- 코드 수정 시 Fast Refresh를 통해 변경 사항 반영
- 네트워크 연결이 어려운 경우 npx expo start --tunnel 시도 가능