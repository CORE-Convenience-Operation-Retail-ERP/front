# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# CORE-ERP 프론트엔드

## 기상청 API 연동 날씨별 매출 분석

### 개요
- 매출 분석 차트에서 기상청 공공데이터 API를 활용한 실제 날씨 데이터 표시
- 기상청 '지상(종관, ASOS) 일자료 조회서비스' API를 통한 과거 날씨 데이터 활용
- 백엔드에서 날씨 데이터를 조회하고, 프론트엔드에서는 차트로 시각화

### 지원하는 날씨 상태
- 맑음 (☀️)
- 구름많음 (⛅)
- 구름 (☁️)
- 흐림 (☁️)
- 비 (🌧️)
- 소나기 (🌦️)
- 비/눈 (🌨️)
- 눈 (❄️)
- 안개 (🌫️)
- 먼지 (😷)

### 차트 기능
- 날씨별 매출 분석 및 거래 건수 표시
- 날씨별 평균 매출에 대한 영향률 제공
- 각 날씨 조건이 발생한 일수 및 비율 표시
- 날씨별 색상과 아이콘으로 직관적인 시각화

### 설정 방법
- 백엔드 `application.properties` 파일에 기상청 API 키 설정 필요
- 기본적으로 서울 지점(108) 기준으로 날씨 데이터 수집
- 다른 지역의 날씨 데이터가 필요한 경우 백엔드 코드에서 지점번호 변경 필요

### 주요 컴포넌트
- `WeatherSalesChart.js`: 날씨별 매출 데이터 시각화
- `SalesAnalysisService.js`: 백엔드 API 호출 처리
