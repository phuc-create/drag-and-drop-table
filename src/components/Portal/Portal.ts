import React from 'react'
import ReactDOM from 'react-dom'

export interface PortalProps {
  children?: React.ReactNode
  container?: HTMLElement
}

const Portal = ({ children, container }: PortalProps) => {
  const mountNode: HTMLElement = container || document.body
  return ReactDOM.createPortal(children, mountNode)
}

export default Portal
