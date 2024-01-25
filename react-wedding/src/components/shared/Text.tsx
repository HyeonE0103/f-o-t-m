import React from 'react'

const Text = ({ children }: { children: string }) => {
  const message = children.split('\n').map((str, i, array) => {
    // \n이 있어도 줄바꿈이 되지 않아서 문자열을 \n마다 끊어서 <br/>을 넣어줌
    return (
      <React.Fragment key={i}>
        {str}
        {i === array.length - 1 ? null : <br />}
      </React.Fragment>
    )
  })
  return <div>{message}</div>
}

export default Text
