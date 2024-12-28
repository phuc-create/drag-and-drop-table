import React from 'react'
import { cn } from '../../utils/classname'
interface TableViewHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const TableViewHeader = ({
  children,
  className,
  ...props
}: TableViewHeaderProps) => {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default TableViewHeader
