import React, { ErrorInfo } from 'react'

//라이프사이클을 사용하기 때문에 클래스 컴포넌트

//동작
//에러가 발생하면 getDerivedStateFromError이 반응을 하게 됨
//리턴된 값을 가지고 ErrorBoundary에서 state를 업데이트 함
//업데이트하게 되면 다시 리렌더링 하게 됨
//그러면 당시 state를 바라보고 에러가 발생했다면 밑에 에러용 컴포넌트를 그림
//에러가 발생하지 않았다면 기본 원래 그리고 싶었던 컴포넌트를 그림

interface Props {
  children: React.ReactNode
  fallbackComponent?: React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { hasError: false }
    //에러 발생 여부
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      //this.state에 hasError인 경우 즉, 에러가 발생한 경우
      if (this.props.fallbackComponent != null) {
        //폴백 컴포넌트가 있다면 해당 폴백 컴포넌트를 그리도록 함
        return <>{this.props.fallbackComponent}</>
      }
      return (
        //폴백 컴포넌트가 없으면 공통 에러 컴포넌트를 그림
        <div>
          <h2>알 수 없는 문제가 발생했어요</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            //재시도를 하면 hasError가 false가 되면서 해당 컴포넌트를 다시 그릴려고 시도함
          >
            재시도
          </button>
        </div>
      )
    }

    // 에러가 발생하지 않은 경우에는 원래 그릴려는것 그림
    return this.props.children
  }
}

export default ErrorBoundary
