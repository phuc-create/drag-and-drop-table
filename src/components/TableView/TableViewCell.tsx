import React from 'react'
interface TableViewCellProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode
}

const TableViewCell: React.FC<TableViewCellProps> = ({
  children,
  ...props
}) => {
  return <div {...props}>{children}</div>
}

export default TableViewCell
