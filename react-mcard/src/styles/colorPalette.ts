import { css } from '@emotion/react'

export const colorPalette = css`
  :root {
    --red: #f44336;
    --blue: #2196f3;
    --green: #4caf50;
    --white: #fff;
    --black: #212121;
    --gray: #f0efef;
  }
`
export const colors = {
  //매번 var(--red)으로 쓰기 불편하니 colors.red로 쓸수 있도록
  red: 'var(--red)',
  blue: 'var(--blue)',
  green: 'var(--green)',
  white: 'var(--white)',
  black: 'var(--black)',
  gray: 'var(--gray)',
}

export type Colors = keyof typeof colors
//키값만 빼와서 type 선언
//type Colors = "red" | "blue" | "green" | "white" | "black" | "gray"
