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
            onMouseLeave={() => setHoverOver(false)}
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

  const renderRows = useCallback(() => {
    return (
      <TableBody>
        {mockTableData.map(row => (
          <TableRow key={row.id}>
            {columnHeader.map(col => {
              return (
                <TableCell key={col.key} className="font-medium">
                  {(row as any)[col.key]}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    )
  }, [columnHeader])

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1>Drag and Drop table (Vite + React + Bun) </h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columnHeader.map((head, i) => {
              return (
                <DraggableColumn
                  key={head.key}
                  columns={columnHeader}
                  head={head}
                  data={mockTableData}
                  order={i}
                  handleSetColumns={handleSetColumns}
                />
              )
            })}
          </TableRow>
        </TableHeader>

        {renderRows()}
      </Table>
    </>
  )
}

export default App
