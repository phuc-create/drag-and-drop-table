import React from 'react'
import { cn } from '../../utils/classname'
interface TableBodyProps extends React.ComponentPropsWithoutRef<'tbody'> {
  children?: React.ReactNode
}

const TableBody = ({ children, className, ...props }: TableBodyProps) => {
  return (
    <tbody className={cn('', className)} {...props}>
      {children}
    </tbody>
  )
}

export default TableBody
