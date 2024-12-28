import React from 'react'
import { cn } from '../../utils/classname'
interface TableViewColumnProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const TableViewColumn: React.FC<TableViewColumnProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('flex grow flex-col bg-white text-left', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default TableViewColumn
