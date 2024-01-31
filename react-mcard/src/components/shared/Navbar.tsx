import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import { Link, useLocation } from 'react-router-dom'

import { useCallback } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/remote/firebase'
import useUser from '@/hooks/auth/useUser'

import Button from '@shared/Button'
import Flex from '@shared/Flex'

const Navbar = () => {
  const location = useLocation()
  const showSignButton =
    ['/signup', '/signin'].includes(location.pathname) === false

  const user = useUser()

  const handleLogout = useCallback(() => {
    signOut(auth)
  }, [])

  const renderButton = useCallback(() => {
    if (user != null) {
      //로그인한 상태
      return <Button onClick={handleLogout}>로그아웃</Button>
    }

    if (showSignButton) {
      //로그인 하지 않은 상태
      return (
        <Link to="/signin">
          <Button>로그인/회원가입</Button>
        </Link>
      )
    }

    return null
  }, [user, showSignButton, handleLogout])

  return (
    <Flex justify="space-between" align="center" css={navbarContainerStyle}>
      <Link to="/">홈</Link>
      {renderButton()}
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
