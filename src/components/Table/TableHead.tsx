import React from 'react'
import { cn } from '../../utils/classname'
interface TableHeadProps extends React.ComponentPropsWithoutRef<'th'> {
  children?: React.ReactNode
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        {...props}
        className={cn(
          'h-full cursor-move bg-gray-200 px-4 py-2 font-bold',
          className
        )}
      >
        {children}
      </th>
    )
  }
)
TableHead.displayName = 'TableHead'
export default TableHead
