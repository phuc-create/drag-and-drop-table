import React, { useCallback, useEffect, useRef, useState } from 'react'
import { mockTableData } from './mock-data'
import {
  TableView,
  TableViewCell,
  TableViewColumn,
  TableViewHead,
  TableViewHeader
} from './components/TableView'
import './App.css'
import { cn } from './utils/classname'
import Portal from './components/Portal'

type HeaderNode = { key: string; node: string }
type DataKey = keyof (typeof mockTableData)[0]

interface DraggableColumnViewProps<T> {
  columns: HeaderNode[]
  head: HeaderNode
  data: T[]
  order: number
  handleSetColumns: (columns: HeaderNode[]) => void
}
const d = 'dragging'
const DraggableColumnView = <T extends Record<string, any>>({
  columns,
  head,
  data,
  order,
  handleSetColumns
}: DraggableColumnViewProps<T>) => {
  const dragNodeRef = useRef<HTMLDivElement | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)
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
    <div className="group relative box-border flex grow border-l-2">
      {hoverOver ? (
        <Portal>
          <TableViewColumn
            ref={dragNodeRef}
            className={cn('absolute z-10 box-border', active && 'shadow-xl')}
            // since the data is generic, so I use order index for detect drag drop area
            data-order={order + ''}
          >
            <TableViewHead
              className={cn(
                'cursor-grab border-2 border-b-0 border-transparent p-2'
                // active ? 'border-dashed border-green-700' : ''
              )}
              onMouseLeave={() => setHoverOver(false)}
            >
              {head.node}
            </TableViewHead>
            {data.map((row, id) => {
              return (
                <TableViewCell
                  key={id}
                  className={cn(
                    'border-x-2 border-x-transparent p-2'
                    // active ? 'border-dashed border-x-green-700' : '',
                    // id === data.length - 1 && 'border-b-2 border-b-green-700'
                  )}
                >
                  {row[head.key as DataKey]}
                </TableViewCell>
              )
            })}
          </TableViewColumn>
        </Portal>
      ) : null}

      {/* Visible column */}
      <TableViewColumn
        ref={targetRef}
        className={cn(
          'z-10 box-border',
          active ? 'border-dashed border-green-700 opacity-20' : ''
        )}
        // since the data is generic, so I use order index for detect drag drop area
        data-order={order + ''}
      >
        <TableViewHead
          className={cn(
            'cursor-grab border-2 border-b-0 p-2 active:cursor-grabbing'
          )}
          onMouseOver={() => setHoverOver(true)}
        >
          {head.node}
        </TableViewHead>
        {data.map((row, id) => {
          return (
            <TableViewCell
              key={id}
              className="select-none border-x-2 border-x-transparent p-2"
            >
              {row[head.key as DataKey]}
            </TableViewCell>
          )
        })}
      </TableViewColumn>
    </div>
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
      <TableView className="relative box-border">
        <TableViewHeader className="group relative">
          {columnHeader.map((head, order) => {
            return (
              <DraggableColumnView
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
