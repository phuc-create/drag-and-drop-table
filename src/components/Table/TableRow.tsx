import React from 'react'
import { cn } from '../../utils/classname'
interface TableRowProps extends React.ComponentPropsWithoutRef<'tr'> {
  children?: React.ReactNode
}

const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <tr {...props} className={cn('', className)}>
      {children}
    </tr>
  )
}

export default TableRow
