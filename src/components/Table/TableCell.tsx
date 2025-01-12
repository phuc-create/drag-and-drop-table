import React from 'react'
import { cn } from '../../utils/classname'
interface TableViewCellProps extends React.ComponentPropsWithoutRef<'td'> {
  children?: React.ReactNode
}

const TableCell: React.FC<TableViewCellProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <td {...props} className={cn('px-4 py-2 text-left', className)}>
      {children}
    </td>
  )
}

export default TableCell
