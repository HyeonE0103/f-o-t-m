import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from './Button'
import Flex from './Flex'

const Navbar = () => {
  const location = useLocation()
  const showSignButton =
    ['/signup', '/signin'].includes(location.pathname) === false

  return (
    <Flex justify="space-between" align="center" css={navbarContainerStyle}>
      <Link to="/">홈</Link>
      {showSignButton && (
        <Link to="/signup">
          <Button>로그인/회원가입</Button>
        </Link>
      )}
    </Flex>
  )
}
export default Navbar

const navbarContainerStyle = css`
  padding: 10px 20px;
  position: sticky; //스크롤이 내려가도 상단에 있도록
  top: 0;
  background-color: ${colors.white};
  z-index: 10;
  border-bottom: 1px solid ${colors.gray};
`
