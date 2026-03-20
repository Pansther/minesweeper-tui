import useGameContext from '../context'

const useNavigate = () => {
  const [{ isPlay }, setGame] = useGameContext()

  const navigate = (key: 'up' | 'down' | 'left' | 'right') => {
    if (!isPlay) return

    switch (key) {
      case 'up':
        setGame((s) => {
          if (s.selectedIndex.row <= 0) {
            s.selectedIndex.row = s.playRows[0].length - 1
          } else {
            s.selectedIndex.row -= 1
          }
        })
        break
      case 'down':
        setGame((s) => {
          s.selectedIndex.row += 1
          s.selectedIndex.row %= s.playRows[0].length
        })
        break
      case 'left':
        setGame((s) => {
          if (s.selectedIndex.col <= 0) {
            s.selectedIndex.col = s.playRows[1].length - 1
          } else {
            s.selectedIndex.col -= 1
          }
        })
        break
      case 'right':
        setGame((s) => {
          s.selectedIndex.col += 1
          s.selectedIndex.col %= s.playRows[1].length
        })
        break
    }
  }

  return {
    navigate,
  }
}

export default useNavigate
