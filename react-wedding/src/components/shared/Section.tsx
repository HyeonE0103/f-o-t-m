import React from 'react'
import styles from './Section.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const Section = ({
  children,
  className,
  title,
}: {
  children: React.ReactNode
  className?: string
  title?: React.ReactNode
}) => {
  return (
    <div className={cx(['container', className])}>
      {title != null && <div className={cx('txt-title')}>{title}</div>}
      {children}
    </div>
  )
}

export default Section
