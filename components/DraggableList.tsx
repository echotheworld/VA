'use client'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { StrictMode } from 'react'

interface DraggableListProps {
  project: any[]
  onDragEnd: (result: any) => void
  renderItem: (provided: any, snapshot: any, item: any) => React.ReactNode
}

export function DraggableList({ project, onDragEnd, renderItem }: DraggableListProps) {
  return (
    <StrictMode>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable 
          droppableId="droppable-list"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
          mode="standard"
          type="DEFAULT"
          direction="vertical"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {project.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                  isDragDisabled={false}
                >
                  {(provided, snapshot) => renderItem(provided, snapshot, item)}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </StrictMode>
  )
} 