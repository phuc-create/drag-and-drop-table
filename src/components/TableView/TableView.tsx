import React from 'react'
import _ from 'lodash'
import { cn } from '../../utils/classname'

export interface TableViewProps
  extends React.ComponentPropsWithoutRef<'table'> {
  children?: React.ReactNode
}

const TableView = ({ className, children }: TableViewProps) => {
  return (
    <div className="overflow-x-auto m-4">
      <div
        className={cn(
          'border border-gray-400 w-full border-solid border-collapse',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default TableView
