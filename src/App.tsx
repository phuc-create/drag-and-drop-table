import React, { useCallback, useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import { mockTableData } from './mock-data'
import {
  TableView,
  TableViewCell,
  TableViewColumn,
  TableViewHead,
  TableViewHeader
} from './components/TableView'
import './App.css'
type HeaderNode = { key: string; node: string }
type DataKey = keyof (typeof mockTableData)[0]

function App() {
  const [columnHeader, setColumnHeader] = useState<HeaderNode[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setIsDragging(true)
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
      const newColumns = [...columnHeader]
      const [draggedColumn] = newColumns.splice(Number(dragIndex), 1)
      newColumns.splice(index, 0, draggedColumn)
      setColumnHeader(newColumns)
    }
    setIsDragging(false)
  }

  const preventChildrenDragEvent = (e: React.DragEvent<HTMLDivElement>) => {
    // children node should have draggble attribute so that this one can work as expected
    e.preventDefault()
    // e.stopPropagation()
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
          {columnHeader.map((head, id) => {
            return (
              <TableViewColumn
                key={head.key + '-' + id}
                draggable
                onDragStart={e => handleDragStart(e, id)}
                onDragEnd={() => setIsDragging(false)}
                onDragOver={allowDrop}
                onDrop={e => handleDragOver(e, id)}
              >
                <TableViewHead className="p-2 hover:cursor-move">
                  {head.node}
                </TableViewHead>
                {mockTableData.map(row => {
                  return (
                    <TableViewCell
                      draggable
                      key={row.id}
                      className="p-2"
                      onDragStart={preventChildrenDragEvent}
                    >
                      {row[head.key as DataKey]}
                    </TableViewCell>
                  )
                })}
              </TableViewColumn>
            )
          })}
        </TableViewHeader>
      </TableView>
    </>
  )
}

export default App
