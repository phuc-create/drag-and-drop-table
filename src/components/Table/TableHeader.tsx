import React from 'react'
import { cn } from '../../utils/classname'
interface TableHeaderProps extends React.ComponentPropsWithoutRef<'thead'> {
  children?: React.ReactNode
}

const TableHeader = ({ children, className, ...props }: TableHeaderProps) => {
  return (
    <thead className={cn('', className)} {...props}>
      {children}
    </thead>
  )
}

export default TableHeader
