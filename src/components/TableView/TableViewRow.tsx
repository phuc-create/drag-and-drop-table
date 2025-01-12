import React from 'react'
import { cn } from '../../utils/classname'
interface TableViewRowProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const TableViewRow: React.FC<TableViewRowProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn('flex w-full items-center justify-between', className)}
    >
      {children}
    </div>
  )
}

export default TableViewRow
