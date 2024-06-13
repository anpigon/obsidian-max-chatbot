import {Component, ErrorInfo, ReactNode} from 'react';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {hasError: false};
	}

	static getDerivedStateFromError(error: Error): State {
		// 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
		return {hasError: true};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
		logErrorToMyService(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			// 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
			return <h1>Something went wrong.</h1>;
		}

		return this.props.children;
	}
}

// 에러 리포팅 서비스 함수 (예제)
function logErrorToMyService(error: Error, errorInfo: ErrorInfo) {
	// 에러를 리포팅하는 로직을 여기에 추가하세요
	console.error('Error logged to my service:', error, errorInfo);
}
