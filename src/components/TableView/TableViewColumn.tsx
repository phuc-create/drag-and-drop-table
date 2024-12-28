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
      className={cn('flex flex-col text-left grow bg-white', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default TableViewColumn
