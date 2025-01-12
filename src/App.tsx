import React, { useCallback, useEffect, useRef, useState } from 'react'
import { mockTableData } from './mock-data'

import './App.css'
import { cn } from './utils/classname'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './components/Table'
import Portal from './components/Portal'
type HeaderNode = { key: string; node: string }

interface DraggableColumnProps<T> {
  columns: HeaderNode[]
  head: HeaderNode
  data: T[]
  order: number
  handleSetColumns: (columns: HeaderNode[]) => void
}
const d = 'dragging'

const DraggableColumn = <T extends Record<string, any>>({
  columns,
  head,
  data,
  order,
  handleSetColumns
}: DraggableColumnProps<T>) => {
  const dragNodeRef = useRef<HTMLTableElement | null>(null)
  const targetRef = useRef<HTMLTableCellElement | null>(null)
  const [active, setActive] = useState(false)
  const [hoverOver, setHoverOver] = useState(false)

  const dragStart = (e: MouseEvent) => {
    e.preventDefault()
    if (!dragNodeRef.current) return
    setActive(true)
    const node = dragNodeRef.current
    node.style.pointerEvents = 'none'
    node.style.zIndex = '100'

    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragEnd)

    node.classList.add(d)
    document.body.style.cursor = 'move'
  }

  const dragMove = (e: MouseEvent) => {
    document.documentElement.style.overflow = 'hidden'
    e.preventDefault()
    if (dragNodeRef.current) {
      const node = dragNodeRef.current
      const rect = node.getBoundingClientRect()

      node.style.top = e.clientY - 20 + 'px'
      node.style.left = e.clientX + window.scrollX - rect.width / 2 + 'px'

      // detect the column under the cursor
      const allColumns = document.querySelectorAll('[data-order]')
      // allColumns.forEach(col => col.classList.remove('hover-highlight')) // Remove previous highlights

      const currentCusor = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement
      const targetColumn = currentCusor?.closest('[data-order]')
      // skip hightlight if same node
      if (targetColumn && !targetColumn.isSameNode(node)) {
        // targetColumn.classList.add('hover-highlight') // Highlight the current column
        const hoverOrder = targetColumn.getAttribute('data-order')
        console.log('Hovering over order:', hoverOrder)
      }
    }
  }

  const dragEnd = (e: MouseEvent) => {
    e.preventDefault()
    if (!dragNodeRef.current || !targetRef.current) return
    setActive(false)
    setHoverOver(false)
    const allColumns = document.querySelectorAll('[data-order]')
    // allColumns.forEach(col => col.classList.remove('hover-highlight')) // Clear highlights

    // there always have element on screen
    const currentCusor = document.elementFromPoint(
      e.clientX,
      e.clientY
    ) as HTMLElement
    const targetColumn = currentCusor?.closest('[data-order]')
    const dropOrder = targetColumn?.getAttribute('data-order')

    console.log('drop order', dropOrder)
    if (dropOrder) {
      console.log('Dropped on order:', dropOrder)

      // reordering logic
      const newColumns = [...columns]
      const draggedColumn = newColumns.splice(order, 1)[0]
      newColumns.splice(Number(dropOrder), 0, draggedColumn)

      handleSetColumns(newColumns)
    }
    if (dropOrder && dropOrder === order + '') {
      setTimeout(() => {
        setHoverOver(true)
      }, 0)
    }
    resetPos()

    dragNodeRef.current.style.zIndex = ''
    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('mouseup', dragEnd)

    document.body.style.cursor = ''
    document.documentElement.style.overflow = ''
  }

  const [cols, setCols] = useState(columns)
  const [rows, setRows] = useState(data)
  const [dragOver, setDragOver] = useState('')
  console.log(cols)
  const handleDragStart = (e: React.DragEvent<HTMLTableElement>) => {
    const { id } = e.target
    const idx = cols.indexOf(id)
    e.dataTransfer.setData('colIdx', idx)
  }

  const handleDragOver = e => e.preventDefault()
  const handleDragEnter = e => {
    const { id } = e.target
    setDragOver(id)
  }

  const handleOnDrop = e => {
    const { id } = e.target
    const droppedColIdx = cols.indexOf(id)
    const draggedColIdx = e.dataTransfer.getData('colIdx')
    const tempCols = [...cols]

    tempCols[draggedColIdx] = cols[droppedColIdx]
    tempCols[droppedColIdx] = cols[draggedColIdx]
    setCols(tempCols)
    setDragOver('')
  }

  const resetPos = () => {
    if (!dragNodeRef.current || !targetRef.current) return
    const targetRect = targetRef.current.getBoundingClientRect()
    const node = dragNodeRef.current
    node.style.top = targetRect.top + 'px'
    node.style.left = targetRect.left + 'px'
    node.style.width = targetRect.width + 'px'

    node.classList.remove(d)
  }

  useEffect(() => {
    resetPos()
  }, [hoverOver])

  useEffect(() => {
    const node = dragNodeRef.current
    if (node) {
      node.addEventListener('mousedown', dragStart)
    }
    return () => {
      node?.removeEventListener('mousedown', dragStart)
    }
  }, [hoverOver])

  return (
    <>
      {hoverOver ? (
        <Portal>
          <Table
            ref={dragNodeRef}
            className={cn('absolute z-10', active && 'shadow-xl')}
            onDragStart={e => handleDragStart(e)}
            onDragOver={handleDragOver}
            onDrop={handleOnDrop}
            onDragEnter={handleDragEnter}
          >
            <TableHeader className={cn('cursor-grab')}>
              <TableRow>
                <TableHead
                  // since the data is generic, so I use order index for detect drag drop area
                  data-order={order + ''}
                >
                  {head.node}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, id) => {
                return (
                  <TableRow key={id}>
                    <TableCell>{row[head.key]}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Portal>
      ) : null}

      {/* Visible column */}
      <TableHead
        key={head.key}
        ref={targetRef}
        className={cn(
          'z-10 box-border cursor-grab active:cursor-grabbing',
          active ? 'opacity-20' : ''
        )}
        // since the data is generic, so I use order index for detect drag drop area
        data-order={order + ''}
        onMouseOver={() => setHoverOver(true)}
      >
        {head.node}
      </TableHead>
    </>
  )
}
type ColumnType = { node: string; disabled: boolean }
function App() {
  const targetRef = useRef<HTMLTableCellElement | null>(null)
  const [data, setData] = useState<Record<string, any>[]>(mockTableData)

  const [cols, setCols] = useState<Array<ColumnType>>(
    Object.keys(mockTableData[0]).map(k => ({ node: k, disabled: false }))
  )
  // const [rows, setRows] = useState(data)
  const [draggingOrder, setDraggingOder] = useState('')
  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>) => {
    const { id } = e.currentTarget
    const order = cols.map(c => c.node).indexOf(id)
    e.dataTransfer.setData('order', order + '')
  }
  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) =>
    e.preventDefault()
  const handleDragEnter = (e: React.DragEvent<HTMLTableCellElement>) => {
    const { id } = e.currentTarget
    setDraggingOder(id)
  }

  const handleOnDrop = (e: React.DragEvent<HTMLTableCellElement>) => {
    const { id } = e.currentTarget
    const droppedOrder = cols.map(c => c.node).indexOf(id)
    const draggedOrder = +e.dataTransfer.getData('order')
    const copy = [...cols]

    // swap
    copy[draggedOrder] = cols[droppedOrder]
    copy[droppedOrder] = cols[draggedOrder]
    setCols(copy)
    setDraggingOder('')
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1>Drag and Drop table (Vite + React + Bun) </h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((col, i) => {
              if (col.disabled) return null
              return (
                <TableHead
                  id={col.node}
                  key={col.node}
                  ref={targetRef}
                  className={cn(
                    'z-10 box-border cursor-grab border-l-2 active:cursor-grabbing',
                    draggingOrder === col.node ? 'opacity-20' : '',
                    draggingOrder === col.node
                      ? 'border-dashed border-l-green-700 opacity-20'
                      : ''
                  )}
                  // since the data is generic, so I use order index for detect drag drop area
                  draggable
                  onDragStart={e => handleDragStart(e)}
                  onDragOver={handleDragOver}
                  onDrop={handleOnDrop}
                  onDragEnter={handleDragEnter}
                >
                  {col.node}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              {Object.entries(row).map(([key, val], idx) => {
                return (
                  <TableCell
                    key={val + '-' + Math.random()}
                    className={cn(
                      'border-l-2 border-l-white font-medium',
                      draggingOrder === cols.map(c => c.node)[idx]
                        ? 'border-dashed border-l-green-700'
                        : ''
                    )}
                  >
                    {row[cols.map(c => c.node)[idx]]}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default App
