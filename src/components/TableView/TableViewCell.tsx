import React from 'react'
import { cn } from '../../utils/classname'
interface TableViewCellProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const TableViewCell: React.FC<TableViewCellProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cn('bg-white', className)}>
      {children}
    </div>
  )
}

export default TableViewCell
