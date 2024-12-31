import React from 'react'
import _ from 'lodash'
import { cn } from '../../utils/classname'

export interface TableViewProps
  extends React.ComponentPropsWithoutRef<'table'> {
  children?: React.ReactNode
}

const TableView = ({ className, children }: TableViewProps) => {
  return (
    <div className="m-4">
      <div className={cn('w-full', className)}>{children}</div>
    </div>
  )
}

export default TableView
