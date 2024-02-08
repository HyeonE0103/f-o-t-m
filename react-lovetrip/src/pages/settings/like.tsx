import { useEffect, useState } from 'react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProps,
} from 'react-beautiful-dnd'

import ListRow from '@shared/ListRow'
import FixedBottomButton from '@shared/FixedBottomButton'
import useEditLike from '@components/settings/like/hooks/useEditLike'
import { Like } from '@/models/like'
import { Virtuoso } from 'react-virtuoso'

const generateMocks = () => {
  const mocks = []

  for (let i = 0; i < 1000; i += 1) {
    mocks.push({
      id: `${i}`,
      hotelId: `hotel ${i}`,
      hotelName: `hotel ${i}`,
      hotelMainImageUrl: `hotel ${i}`,
      userId: '',
      order: i,
    } as Like)
  }

  return mocks
}

const LikePage = () => {
  const { data, isEdit, reorder, save } = useEditLike()

  const handleDragEndDrop = (result: DropResult) => {
    if (result.destination == null) {
      //목적지에 정보가 없다면 아무것도 해주지 않음
      return
    }

    const from = result.source.index
    const to = result.destination?.index
    //2번이 1번 위치로 가게 되면 from 1, to 0 즉 1번에서 0번 인덱스로 간것

    reorder(from, to)
  }

  const mocks = generateMocks()

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEndDrop}>
        {/* onDragEnd는 dnd가 끝나면 실행되는 이벤트 */}
        <StrictModeDroppable droppableId="likes">
          {/* Draggable은 인자로 id가 필수 */}
          {(droppableProps) => (
            <ul
              ref={droppableProps.innerRef}
              {...droppableProps.droppableProps}
            >
              <Virtuoso
                useWindowScroll //가상 스크롤 사용
                increaseViewportBy={0} //시작점은 맨위
                itemContent={(index, like) => {
                  //렌더링할 요소 넣어주기
                  //첫번째 인자는 index, 두번째 인자는 data가 하나하나 넘어옴
                  return (
                    // 최소 높이 잡아주기
                    <div style={{ minHeight: 1 }}>
                      <Draggable
                        key={like.id}
                        draggableId={like.id}
                        index={index}
                      >
                        {/* key와 draggableId는 동일해야함 */}
                        {(draggableProps) => (
                          <li
                            ref={draggableProps.innerRef}
                            {...draggableProps.draggableProps}
                            {...draggableProps.dragHandleProps}
                          >
                            {/* 이 안쪽에 있는 요소들이 dnd가 가능해짐 */}
                            <ListRow
                              as="div"
                              contents={
                                <ListRow.Texts
                                  title={like.order}
                                  subTitle={like.hotelName}
                                />
                              }
                            />
                          </li>
                        )}
                      </Draggable>
                    </div>
                  )
                }}
                data={mocks}
                //Test - data대신 mocks 데이터 사용
              />
            </ul>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      {isEdit ? <FixedBottomButton label="저장하기" onClick={save} /> : null}
      {/* 유저가 순서를 변경했다면 저장버튼 띄움 */}
    </div>
  )
}

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  // DragDropContext 밑에 Draggable로 감싸주어야 하는데 React18 string 모드에서 문제가 있음
  // 따라서 Draggable그리는 시점을 애니메이션 프레임 뒤쪽으로 밀어주어야 함
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (enabled === false) {
    return null
  }

  return <Droppable {...props}>{children}</Droppable>
}

export default LikePage
