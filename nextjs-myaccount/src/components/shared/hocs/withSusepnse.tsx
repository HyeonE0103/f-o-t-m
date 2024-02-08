import { Suspense, ComponentType, ReactNode } from 'react'

//widthSusepnse(<App/>, {fallback: <로딩컴포넌트/>})
//App에서는 데이터를 부를때 로딩에 대한 처리를 신경쓰지 않아됨
function withSusepnse<Props = Record<string, never>>(
  WrappedComponent: ComponentType<Props>,
  // 컴포넌트인데 props를 넣어줌
  options: { fallback: ReactNode },
) {
  return function SuspendedComponent(props: Props) {
    // react에서 nextjs로 오면서 컴포넌트 이름 지어줌
    return (
      <Suspense fallback={options.fallback}>
        <WrappedComponent {...(props as any)} />
        {/* props를 그대로 넘겨줌 */}
      </Suspense>
    )
  }
}
// withSusepnse는 HOC로 해당 컴포넌트들을 suspense로 감싸고 fallback을
// 받아서 로딩에 대한 처리를 선언적으로 할 수 있게 도와줌

export default withSusepnse
