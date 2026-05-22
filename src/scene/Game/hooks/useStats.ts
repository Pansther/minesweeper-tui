import { produce } from 'immer'
import { useEffect } from 'react'
import { saveStats } from '@/helpers/stats'
import useStore from '@/store'
import { StatusBarRef } from '../components/StatusBar'
import useGameContext from '../context'
import { GameState, ItemType, MineType } from '../type'

const { Flag, Open } = ItemType
const { Empty } = MineType
const { Fail, Complete } = GameState

const useStats = ({
  ref,
}: {
  focus: { id: string }
  ref?: React.RefObject<StatusBarRef | null>
}) => {
  const difficulty = useStore((s) => s.difficulty)
  const [{ playState, playRows, mines }] = useGameContext()

  useEffect(() => {
    const getExplorationData = () => {
      const openCells = playRows
        .flatMap((col) => col)
        .map((col) => (col === Open ? 1 : 0) as number)
      const totalOpenCell = openCells.reduce((prev, curr) => prev + curr, 0)

      const safeCells = mines
        .flatMap((col) => col)
        .map((col) => (col === Empty ? 1 : 0) as number)
      const totalSafeCell = safeCells.reduce((prev, curr) => prev + curr, 0)

      const flags = playRows
        .flatMap((col) => col)
        .map((col) => (col === Flag ? 1 : 0) as number)
      const mineFlagged = flags.reduce((prev, curr) => prev + curr, 0)

      return {
        mineFlagged,
        totalOpenCell,
        totalSafeCell,
      }
    }

    if ([Complete, Fail].includes(playState)) {
      const duration = ref?.current?.time ?? 0
      const { totalSafeCell, totalOpenCell, mineFlagged } = getExplorationData()

      saveStats((prev) =>
        produce(prev, (s) => {
          s.overall.total += 1
          s.overall.win += playState === Complete ? 1 : 0
          s.overall.totalDuration += duration
          s.overall.totalSafeCell += totalSafeCell
          s.overall.totalSafeCellOpened += totalOpenCell
          s.overall.mineFlagged += mineFlagged

          s.detail[difficulty].total += 1
          s.detail[difficulty].win += playState === Complete ? 1 : 0
          s.detail[difficulty].totalDuration += duration
          s.detail[difficulty].totalSafeCell += totalSafeCell
          s.detail[difficulty].totalSafeCellOpened += totalOpenCell
          s.detail[difficulty].mineFlagged += mineFlagged

          if (
            playState === Complete &&
            (!s.detail[difficulty].bestTime ||
              s.detail[difficulty].bestTime > duration)
          ) {
            s.detail[difficulty].bestTime = duration
          }
        }),
      )
    }
  }, [playState])

  return
}

export default useStats
