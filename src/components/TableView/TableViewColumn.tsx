import React from 'react'
import { cn } from '../../utils/classname'
interface TableViewColumnProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const TableViewColumn = React.forwardRef<HTMLDivElement, TableViewColumnProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'box-border flex grow flex-col bg-white text-left',
          className
        )}
        {...props}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)
TableViewColumn.displayName = 'TableViewColumn'
export default TableViewColumn
