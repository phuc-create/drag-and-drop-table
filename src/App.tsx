import React, { useCallback, useEffect, useState } from 'react'
import { mockTableData } from './mock-data'
import {
  TableView,
  TableViewCell,
  TableViewColumn,
  TableViewHead,
  TableViewHeader
} from './components/TableView'
import './App.css'
import DropIndicator from './components/TableView/DropIndicator'
import { cn } from './utils/classname'
type HeaderNode = { key: string; node: string }
type DataKey = keyof (typeof mockTableData)[0]

interface TableColumnView<T> {
  columns: HeaderNode[]
  head: HeaderNode
  data: T[]
  order: number
  handleSetColumns: (columns: HeaderNode[]) => void
}

const TableColumnView = <T extends Record<string, any>>({
  columns,
  head,
  data,
  order,
  handleSetColumns
}: TableColumnView<T>) => {
  const [active, setActive] = useState(false)

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setActive(true)
    console.log(e.dataTransfer)
    e.dataTransfer.setData('columnIndex', index + '')
  }
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault()
    const dragIndex = e.dataTransfer.getData('columnIndex')
    if (dragIndex !== index + '') {
      const newColumns = [...columns]
      const [draggedColumn] = newColumns.splice(Number(dragIndex), 1)
      newColumns.splice(index, 0, draggedColumn)
      handleSetColumns(newColumns)
    }
    // setIsDragging(false)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setActive(false)
  }

  const preventChildrenDragEvent = (e: React.DragEvent<HTMLDivElement>) => {
    // children node should have draggble attribute so that this one can work as expected
    e.preventDefault()
    // e.stopPropagation()
  }

  return (
    <TableViewColumn
      draggable
      onDragStart={e => handleDragStart(e, order)}
      onDragEnd={handleDragLeave}
      onDragOver={allowDrop}
      onDrop={e => handleDragOver(e, order)}
      className={cn(
        'border-2 border-transparent',
        active ? 'border-dashed border-green-700' : '',
        active ? 'opacity-20' : 'opacity-100'
      )}
    >
      {/* <DropIndicator /> */}
      <TableViewHead className="cursor-grab p-2 active:cursor-grabbing">
        {head.node}
      </TableViewHead>
      {data.map((row, id) => {
        return (
          <TableViewCell
            draggable
            key={id}
            className="p-2"
            onDragStart={preventChildrenDragEvent}
          >
            {row[head.key as DataKey]}
          </TableViewCell>
        )
      })}
      {/* <DropIndicator /> */}
    </TableViewColumn>
  )
}

function App() {
  const [columnHeader, setColumnHeader] = useState<HeaderNode[]>([])

  const handleSetColumns = (columns: HeaderNode[]) => {
    setColumnHeader(columns)
  }

  // effects
  useEffect(() => {
    let headerData: { key: string; node: string }[] = []
    if (mockTableData.length > 0) {
      const keys = Object.keys(mockTableData[0])
      headerData = keys.map(key => ({
        key,
        node: key
      }))
    }
    setColumnHeader(headerData)
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1>Drag and Drop table (Vite + React + Bun) </h1>
      </div>
      <TableView>
        <TableViewHeader className="group">
          {columnHeader.map((head, order) => {
            return (
              <TableColumnView
                key={head.key + '-' + order}
                columns={columnHeader}
                head={head}
                data={mockTableData}
                handleSetColumns={handleSetColumns}
                order={order}
              />
            )
          })}
        </TableViewHeader>
      </TableView>
    </>
  )
}

export default App
