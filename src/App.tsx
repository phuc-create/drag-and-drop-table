import React, { useEffect, useState } from 'react'
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

type DataKey = keyof (typeof mockTableData)[0]

function App() {
  const [columnHeader, setColumnHeader] = useState<
    { key: string; node: string }[]
  >([])
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
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <h1>Vite + React</h1>
      </div>
      <TableView className="mb-8">
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
                    <TableViewCell key={row.id} className="p-2">
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
