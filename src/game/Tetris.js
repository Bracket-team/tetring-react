import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // React Router 사용
import { endRound } from './endRoundAPI';
import { getGameResult } from './getGameResultAPI';
import ResultModal from './ResultModal';

// 테트리스 보드 크기 및 캔버스 설정
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 40;
const DROP_INTERVAL = 1000; // 블록이 자동으로 내려오는 간격 (ms)

// 블록 색상 매핑
const COLORS = {
  0: "#7f7f7f", // 빈 칸
  1: "#00ffff", // I 블록 하늘
  2: "#0000ff", // J 블록 파란
  3: "#ff7f00", // L 블록 귤
  4: "#ffff00", // O 블록 노란
  5: "#00ff00", // S 블록 연두
  6: "#800080", // T 블록 자주
  7: "#ff0000", // Z 블록 빨강
  8: "#bcbcbc", // 회색 줄 블록
};

// 색상을 숫자로 매핑
const COLOR_CODES = {
  "하늘색": 1,
  "파란색": 2,
  "귤색": 3,
  "노란색": 4,
  "연두색": 5,
  "자주색": 6,
  "빨간색": 7
};

// 라인 클리어와 콤보 점수 매핑
const lineClearPoints = {
  1: 1,   // 싱글
  2: 5,   // 더블
  3: 15,  // 트리플
  4: 30   // 테트리스
};

const comboPoints = {
  0: 0,
  1: 5,
  2: 10,
  3: 15,
  4: 20
};


// 점수를 계산하는 함수
const calculateScore = (linesCleared, comboCount) => {
  const lineScore = lineClearPoints[linesCleared] || 0;
  const comboScore = comboPoints[comboCount] || 0;
  return lineScore * comboScore;
};

// 배열을 셔플하는 함수
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

// 백엔드에서 받은 `player_blocks`를 변환하는 함수
const transformPlayerBlocks = (playerBlocks) => {
  return playerBlocks.map((block) => {
    const { color, shape } = block;
    const colorCode = COLOR_CODES[color];
    
    const shapeArray = [];
    for (let i = 0; i < shape.length; i += 4) {
      const row = shape.slice(i, i + 4).split("").map((cell) => (cell === "1" ? colorCode : 0));
      shapeArray.push(row);
    }
    return { ...block, shape: shapeArray };
  });
};

// 블록의 빈 행을 제거하여 맨 위에 맞추는 함수
const trimTetromino = (tetromino) => {
  if (!tetromino) return [];
  const nonEmptyRows = tetromino.filter(row => row.some(cell => cell !== 0));
  const nonEmptyCols = nonEmptyRows[0].map((_, colIndex) => 
    nonEmptyRows.some(row => row[colIndex] !== 0)
  );
  return nonEmptyRows.map(row => row.filter((_, colIndex) => nonEmptyCols[colIndex]));
};

// 빈 보드 생성 함수
const createEmptyBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

// 충돌 감지 함수
const collide = (area, player) => {
  const { matrix, pos } = player;
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[y].length; ++x) {
      if (
        matrix[y][x] !== 0 && 
        (area[y + pos.y] && area[y + pos.y][x + pos.x]) !== 0 // 유효 범위 내 충돌 체크
      ) {
        return true;
      }
    }
  }
  return false;
};

// 테트리스 게임 컴포넌트
const TetrisGame = ({ gameData, updateScores = () => { }, nowtotalscore} ) => {
  const navigate = useNavigate(); // 페이지 전환을 위한 useNavigate 훅
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultData, setResultData] = useState(null);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  useEffect(() => {
    if (resultData) {
      setIsModalOpen(true);
    }
  }, [resultData]);

  // 라운드 종료 API 함수
  const handleEndGame = async () => {
    const result = await endRound(nowtotalscore);

    if (result.success) {
      const { is_win, next_round_number, next_round_goal, money } = result.data.data;
      
      if (is_win) {
        // is_win이 true인 경우 /shopdata 페이지로 이동
        navigate('/shopdata',{ state: { result: result.data.data, gameData: gameData} });
    } else {
        // is_win이 false인 경우 다른 처리나 상태 업데이트 가능
        const gameResult = await getGameResult();
          if (gameResult.success) {
            setResultData(gameResult.data); // 받아온 결과 데이터 설정
          } else {
              console.error("게임 결과 불러오기 실패:", gameResult.error);
          }
    }
    } else {
        console.error("게임 종료 실패:", result.error);
        // 에러 상태 업데이트 로직이 필요할 경우 여기에 추가
    }
  };
  
  // 첫 로드 시 `playerBlocks`를 초기화하고 저장
  const initialPlayerBlocksRef = useRef(shuffleArray(transformPlayerBlocks(gameData.player_blocks)));
  const [playerBlocks, setPlayerBlocks] = useState(initialPlayerBlocksRef.current);

  // 첫 번째 블록과 초기 다음 블록 설정
  const [currentTetromino, setCurrentTetromino] = useState(trimTetromino(playerBlocks[0].shape));
  const [nextBlocks, setNextBlocks] = useState(playerBlocks.slice(1, 4));
  const [currentPosition, setCurrentPosition] = useState({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });

  // 게임 관련 상태 선언
  const [board, setBoard] = useState(createEmptyBoard());
  const [blockCount, setBlockCount] = useState(1);
  const [totalScore, setTotalScore] = useState(0); // 총 점수
  const [lineScore, setLineScore] = useState(0); // 라인 점수
  const [comboScore, setComboScore] = useState(0); // 콤보 점수
  const [comboCount, setComboCount] = useState(0); // 콤보 횟수
  const [gameOver, setGameOver] = useState(false);
  const [canHold, setCanHold] = useState(true);
  const [heldBlock, setHeldBlock] = useState(null); // 저장된 블럭

  // 캔버스 관리
  const canvasRef = useRef(null);
  const heldCanvasRef = useRef(null);
  const nextCanvasRef = useRef(null);

  // 게임이 종료되면 상점 화면으로 전환
  useEffect(() => {
    if (gameOver) {
      handleEndGame();
    }
  }, [gameOver, navigate]);

  useEffect(() => {
    if (playerBlocks.length > 0 && !currentTetromino) {
        const firstTetromino = generateNextTetromino();
        setCurrentTetromino(firstTetromino);
    }
  }, [playerBlocks, currentTetromino]);
  
  // 블록 자동으로 내려오는 기능 추가
  useEffect(() => {
    if (!gameOver) {
      const dropInterval = setInterval(() => {
        playerDrop();
      }, DROP_INTERVAL);

      return () => clearInterval(dropInterval); // 컴포넌트가 언마운트되거나 게임이 끝나면 인터벌 정리
    }
  }, [currentPosition, gameOver]);

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 37) playerMove(-1);
      else if (event.keyCode === 39) playerMove(1);
      else if (event.keyCode === 40) playerDrop();
      else if (event.keyCode === 90) playerRotate(-1);
      else if (event.keyCode === 88) playerRotate(1);
      else if (event.keyCode === 32) playerHardDrop();
      else if (event.keyCode === 67) swapHold(); // 'C'키로 블럭을 홀드 (저장) 기능 추가
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPosition, currentTetromino, board]);

  // 보드와 블록을 그리는 함수
  useEffect(() => {
    if (currentTetromino) {
      drawBoard();
    }
  }, [board, currentTetromino, currentPosition]);
  
  
  // 미리 저장된 playerBlocks 배열을 사용하여 다음 블럭을 가져오고, 새로운 블럭을 추가함
  const generateNextTetromino = () => {
    if (playerBlocks.length === 0) {
      if (heldBlock) {
          // playerBlocks가 비어있고, heldBlock이 있을 때 heldBlock을 사용
          const heldTetromino = heldBlock;
          setHeldBlock(null); // heldBlock을 비웁니다.
          return trimTetromino(heldTetromino.shape); // heldBlock을 반환
      } else {
          setGameOver(true); // heldBlock도 없으면 게임 종료
          return null;
      }
    }
    
    const [nextBlock, ...remainingBlocks] = playerBlocks; // 첫 번째 블록과 나머지 블록을 분리

    if (remainingBlocks.length === 0) {
      setGameOver(true);
      return trimTetromino(nextBlock.shape);
    }

    setPlayerBlocks(remainingBlocks); // 첫 번째 블록 사용 후, 남은 블록으로 playerBlocks 업데이트
    setNextBlocks(remainingBlocks.slice(1, 4)); // 업데이트된 remainingBlocks를 사용하여 nextBlocks 설정
  
    return trimTetromino(remainingBlocks[0].shape); // 다음 블럭을 반환
  };

  const playerMove = (dir) => {
    const newX = currentPosition.x + dir;
    if (!collide(board, { matrix: currentTetromino, pos: { x: newX, y: currentPosition.y } })) {
      setCurrentPosition((prev) => ({ ...prev, x: newX }));
    }
  };

  const playerDrop = () => {
    const newY = currentPosition.y + 1;

    if (currentTetromino && !collide(board, { matrix: currentTetromino, pos: { x: currentPosition.x, y: newY } })) {
      setCurrentPosition((prev) => ({ ...prev, y: newY }));
    } else {
      const mergedBoard = mergeTetrominoToBoard({ matrix: currentTetromino, pos: currentPosition });
      const updatedBoard = clearLines(mergedBoard);

      setBoard(updatedBoard);
      setBlockCount((prev) => prev + 1);

      // 게임 오버 체크
      if (checkGameOver(updatedBoard)) {
        setGameOver(true);
        return;  // 게임이 종료되면 새로운 블록을 생성하지 않음
      }

      // 4번째 블록마다 회색 줄 추가
      if (blockCount % 4 === 0) {
        const boardWithGreyLine = riseLineFromBottom(updatedBoard);
        setBoard(boardWithGreyLine);
      }

      setCanHold(true); // 블럭이 내려온 후에 다시 홀드 가능하게 설정
      const nextTetromino = generateNextTetromino();
      if (nextTetromino) {
        setCurrentTetromino(nextTetromino);
        setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
      } else {
        setGameOver(true);
      }
    }
  };

  // 블럭 회전
  const playerRotate = (direction) => {
    if (currentTetromino) {
      const rotatedTetromino = rotateMatrix(currentTetromino, direction);
      if (!collide(board, { matrix: rotatedTetromino, pos: currentPosition })) {
        setCurrentTetromino(rotatedTetromino);
      }
    }
};

const playerHardDrop = () => {
  if (!currentTetromino) return; // currentTetromino가 null일 때 함수 종료

  let newY = currentPosition.y;

  // 블럭이 충돌할 때까지 y 좌표를 아래로 계속 이동시킴
  while (!collide(board, { matrix: currentTetromino, pos: { x: currentPosition.x, y: newY + 1 } })) {
    newY++;
  }

  // 최종 위치에 블럭을 배치
  setCurrentPosition({ x: currentPosition.x, y: newY });
  const mergedBoard = mergeTetrominoToBoard({ matrix: currentTetromino, pos: { x: currentPosition.x, y: newY } });
  const updatedBoard = clearLines(mergedBoard);
  setBoard(updatedBoard);
  setBlockCount((prev) => prev + 1);

  // 게임 오버 체크
  if (checkGameOver(updatedBoard)) {
    setGameOver(true);
    return;
  }

  // 4번째 블록마다 회색 줄 추가
  if (blockCount % 4 === 0) {
    const boardWithGreyLine = riseLineFromBottom(updatedBoard);
    setBoard(boardWithGreyLine);
  }

  setCanHold(true); // 블럭이 내려온 후에 다시 홀드 가능하게 설정

  // 다음 블럭 가져오기
  const nextTetromino = generateNextTetromino();
  if (nextTetromino) { 
    // 다음 블럭이 있으면 설정
    setCurrentTetromino(nextTetromino);
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  } else {
    // 다음 블럭이 없으면 게임 종료
    setGameOver(true);
  }
};

  const rotateMatrix = (matrix, direction) => {
    const rotated = matrix[0].map((_, i) => matrix.map((row) => row[i]));
    return direction === 1 ? rotated.map((row) => row.reverse()) : rotated.reverse();
  };

  const mergeTetrominoToBoard = (player = { matrix: [], pos: { x: 0, y: 0 } }) => {
    const newBoard = board.map((row) => row.slice());
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[player.pos.y + y][player.pos.x + x] = value;
        }
      });
    });
    return newBoard;
  };

  const checkGameOver = (boardToCheck) => {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (boardToCheck[0][x] !== 0 || boardToCheck[1][x] !== 0) {
        return true;
      }
    }
    return false;
  };

  const riseLineFromBottom = (currentBoard) => {
    const newBoard = currentBoard.slice(1);
    const greyRow = Array(BOARD_WIDTH).fill(8);
    const emptySpot = Math.floor(Math.random() * BOARD_WIDTH);
    greyRow[emptySpot] = 0;
    newBoard.push(greyRow);
    return newBoard;
  };

  const clearLines = (boardToCheck) => {
    const updatedBoard = boardToCheck.filter((row) => row.some((cell) => cell === 0));
    const linesCleared = BOARD_HEIGHT - updatedBoard.length;
    
    if (linesCleared > 0) {
      const newLineScore = lineClearPoints[linesCleared] || 0;
      const newComboScore = comboPoints[comboCount] || 0;
      const score = newLineScore * newComboScore;  // 총점 계산

      setLineScore(newLineScore);  // 라인 점수 업데이트
      setComboScore(newComboScore);  // 콤보 점수 업데이트
      setTotalScore((prevScore) => prevScore + score);

      setComboCount((prevCombo) => (linesCleared > 0 ? prevCombo + 1 : 0));

      updateScores(totalScore + score, newLineScore, newComboScore);

      const emptyLines = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0));
      return [...emptyLines, ...updatedBoard];
    }
    return boardToCheck;
  };

  useEffect(() => {
    updateScores(totalScore, lineScore, comboScore);
  }, [totalScore, lineScore, comboScore]);

  const drawGrid = (ctx) => {
    ctx.strokeStyle = "black";
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  const swapHold = () => {
    if (!canHold) return;
    if (!heldBlock) {
      setHeldBlock(currentTetromino);
      setCurrentTetromino(generateNextTetromino());
    } else {
      const temp = heldBlock;
      setHeldBlock(currentTetromino);
      setCurrentTetromino(temp);
    }
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setCanHold(false);
  };

  const drawCanvasBlock = (ctx, block, xOffset = 0, yOffset = 0) => {
    block.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          drawCell(ctx, x + xOffset, y + yOffset, COLORS[value]);
        }
      });
    });
  };

  const getCenteredPosition = (block, canvasSize, cellSize) => {
    const blockWidth = block[0].length * cellSize;
    const blockHeight = block.length * cellSize;
    const xOffset = Math.floor((canvasSize.width - blockWidth) / 2 / cellSize);
    const yOffset = Math.floor((canvasSize.height - blockHeight) / 2 / cellSize);
    return { xOffset, yOffset };
  };

  useEffect(() => {
    const canvas = heldCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#7f7f7f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, 4, 4);
    if (heldBlock) {
      const processedBlock = trimTetromino(heldBlock);
      const { xOffset, yOffset } = getCenteredPosition(processedBlock, { width: canvas.width, height: canvas.height }, CELL_SIZE);
      drawCanvasBlock(ctx, processedBlock, xOffset, yOffset);
    }
  }, [heldBlock]);

  useEffect(() => {
    const canvas = nextCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#7f7f7f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, 4, 12);
    nextBlocks.forEach((block, index) => {
      const processedBlock = trimTetromino(block.shape);
      const { xOffset, yOffset } = getCenteredPosition(processedBlock, { width: 4 * CELL_SIZE, height: 4 * CELL_SIZE }, CELL_SIZE);
      drawCanvasBlock(ctx, processedBlock, xOffset, (index * 4) + yOffset);
    });
  }, [nextBlocks]);

  const drawBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        drawCell(ctx, x, y, COLORS[cell]);
      });
    });

    if (currentTetromino) { // currentTetromino가 null이 아닐 때만 그리기
      currentTetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            drawCell(ctx, currentPosition.x + x, currentPosition.y + y, COLORS[value]);
          }
        });
      });
    }

    drawGrid(ctx);
};

  const drawCell = (ctx, x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  };

  return (
    <div className="tetris-game">
      <canvas id="hold" ref={heldCanvasRef} width={4 * CELL_SIZE} height={4 * CELL_SIZE}></canvas> {/* 왼쪽: 저장 블럭 */}
      <canvas id="tetris" ref={canvasRef} width={BOARD_WIDTH * CELL_SIZE} height={BOARD_HEIGHT * CELL_SIZE}></canvas> {/* 중앙: 게임 보드 */}
      <canvas id="next" ref={nextCanvasRef} width={4 * CELL_SIZE} height={12 * CELL_SIZE}></canvas> {/* 오른쪽: 다음 블럭 */}
      {gameOver}

      {/* 모달 컴포넌트 */}
      {resultData && (
        <ResultModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          resultData={resultData}
          highscore={nowtotalscore}
        />
      )}
    </div>
  );
};

export default TetrisGame;
