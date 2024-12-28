import React from 'react'
import _ from 'lodash'
import { cn } from '../../utils/classname'

export interface TableViewProps
  extends React.ComponentPropsWithoutRef<'table'> {
  children?: React.ReactNode
}

const TableView = ({ className, children }: TableViewProps) => {
  return (
    <div className="m-4 overflow-x-auto">
      <div className={cn('w-full border border-gray-400', className)}>
        {children}
      </div>
    </div>
  )
}

export default TableView
