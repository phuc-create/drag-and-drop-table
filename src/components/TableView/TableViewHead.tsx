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
        'cursor-move items-center justify-start bg-gray-200 font-bold capitalize text-gray-600',
        className
      )}
    >
      {children}
    </div>
  )
}

export default TableViewHead
