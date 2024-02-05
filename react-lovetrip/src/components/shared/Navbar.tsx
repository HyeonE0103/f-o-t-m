import { colors } from '@/styles/colorPalette'
import { css } from '@emotion/react'
import { Link, useLocation } from 'react-router-dom'
import { useCallback } from 'react'

import Button from '@shared/Button'
import Flex from '@shared/Flex'
import useUser from '@/hooks/auth/useUser'

const Navbar = () => {
  const location = useLocation()
  const showSignButton =
    ['/signup', '/signin'].includes(location.pathname) === false

  const user = useUser()

  const renderButton = useCallback(() => {
    if (user != null) {
      //로그인한 상태, 마이페이지로 이동
      return (
        <Link to="/my">
          <img
            src={
              user.photoURL ??
              'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-128.png'
            }
            alt="user img"
            width={40}
            height={40}
            style={{ borderRadius: '100%' }}
          />
        </Link>
      )
    }

    if (showSignButton) {
      //로그인 하지 않은 상태, 로그인화면으로 이동
      return (
        <Link to="/signin">
          <Button>로그인/회원가입</Button>
        </Link>
      )
    }

    return null
  }, [user, showSignButton])

  return (
    <Flex justify="space-between" align="center" css={navbarContainerStyle}>
      <Link to="/" style={{ fontWeight: 'bold' }}>
        Love Trip
      </Link>
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
  border-bottom: 2px solid ${colors.gray100};
`
