import React from 'react'
import { cn } from '../../utils/classname'
interface TableViewHeadProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const TableViewHead: React.FC<TableViewHeadProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        'bg-gray-200 items-center justify-start font-bold cursor-move',
        className
      )}
    >
      {children}
    </div>
  )
}

export default TableViewHead
