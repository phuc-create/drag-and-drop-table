import React from 'react'
import _ from 'lodash'
import { cn } from '../../utils/classname'

export interface TableProps extends React.ComponentPropsWithoutRef<'table'> {
  children?: React.ReactNode
}

const TableView = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <table
        ref={ref}
        className={cn('w-full border-gray-400 bg-white', className)}
        {...props}
      >
        {children}
      </table>
    )
  }
)
TableView.displayName = 'TableView'
export default TableView
