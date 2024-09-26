import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // React Router 사용

// 테트리스 보드 크기 및 캔버스 설정
const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 40;
const DROP_INTERVAL = 1000; // 블록이 자동으로 내려오는 간격 (ms)

// 블록 색상 매핑
const COLORS = {
  0: "#7f7f7f", // 빈 칸
  1: "#00ffff", // I 블록
  2: "#0000ff", // J 블록
  3: "#ff7f00", // L 블록
  4: "#ffff00", // O 블록
  5: "#00ff00", // S 블록
  6: "#800080", // T 블록
  7: "#ff0000", // Z 블록
  8: "#bcbcbc", // 회색 줄 블록
};

// 테트리미노 블록 모양 정의
const tetrominos = [
  [[1, 1, 1, 1]],  // I 블록
  [[0, 2, 0, 0], [0, 2, 2, 2]],  // J 블록
  [[0, 0, 0, 3], [0, 3, 3, 3]],  // L 블록
  [[0, 4, 4,0], [0, 4, 4, 0]],  // O 블록
  [[0, 0, 5, 5], [0, 5, 5, 0]],  // S 블록
  [[0, 0, 6, 0], [0, 6, 6, 6]],  // T 블록
  [[0, 7, 7, 0], [0, 0, 7, 7]],  // Z 블록
];

// 랜덤 테트리미노 생성
const getRandomTetromino = () => tetrominos[Math.floor(Math.random() * tetrominos.length)];

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
const TetrisGame = ({ updateScores = () => {}, round, setRound }) => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentTetromino, setCurrentTetromino] = useState(getRandomTetromino());
  const [currentPosition, setCurrentPosition] = useState({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  const [blockCount, setBlockCount] = useState(1);
  const [lineScore, setLineScore] = useState(0);
  const [comboScore, setComboScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [canHold, setCanHold] = useState(true);
  const [heldBlock, setHeldBlock] = useState(null);  // 저장된 블럭
  const [nextBlocks, setNextBlocks] = useState([getRandomTetromino(), getRandomTetromino(), getRandomTetromino()]); // 다음 3개 블럭
  const canvasRef = useRef(null);
  const heldCanvasRef = useRef(null);
  const nextCanvasRef = useRef(null);
  const navigate = useNavigate(); // 페이지 전환을 위한 useNavigate 훅

  // 게임이 종료되면 상점 화면으로 전환
  useEffect(() => {
    if (gameOver) {
      navigate('/shop'); // 상점 경로로 이동
    }
  }, [gameOver, navigate, round, setRound]);

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
    drawBoard();
  }, [board, currentTetromino, currentPosition]);

  // 미리 저장된 nextBlocks 배열을 사용하여 다음 블럭을 가져오고, 새로운 블럭을 추가함
  const generateNextTetromino = () => {
    const nextBlock = nextBlocks[0]; // 첫 번째 블럭을 현재 블럭으로 설정
    const newNextBlocks = [...nextBlocks.slice(1), getRandomTetromino()]; // 새로운 블럭 추가
    setNextBlocks(newNextBlocks); // nextBlocks 배열 업데이트
    return nextBlock;
  };

  const playerMove = (dir) => {
    const newX = currentPosition.x + dir;
    if (!collide(board, { matrix: currentTetromino, pos: { x: newX, y: currentPosition.y } })) {
      setCurrentPosition((prev) => ({ ...prev, x: newX }));
    }
  };

  const playerDrop = () => {
    const newY = currentPosition.y + 1;
    
    // 충돌이 없는 경우 블록을 한 칸 아래로 이동
    if (!collide(board, { matrix: currentTetromino, pos: { x: currentPosition.x, y: newY } })) {
      setCurrentPosition((prev) => ({ ...prev, y: newY }));
    } else {
      // 충돌 발생 시 블록을 병합
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

      // 블럭이 내려온 후에 다시 홀드 가능하게 설정
      setCanHold(true);

      // 다음 블럭으로 전환
      setCurrentTetromino(generateNextTetromino()); // 다음 블럭을 현재 블럭으로 설정
      setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    }
  };

  const playerRotate = (direction) => {
    const rotatedTetromino = rotateMatrix(currentTetromino, direction);
    if (!collide(board, { matrix: rotatedTetromino, pos: currentPosition })) {
      setCurrentTetromino(rotatedTetromino);
    }
  };

  // 하드 드랍
  const playerHardDrop = () => {
    let newY = currentPosition.y;
  
    // 블록이 충돌할 때까지 y 좌표를 아래로 계속 이동시킴
    while (!collide(board, { matrix: currentTetromino, pos: { x: currentPosition.x, y: newY + 1 } })) {
      newY++;
    }
  
    // 충돌하지 않는 가장 아래 위치로 블록을 이동
    setCurrentPosition({ x: currentPosition.x, y: newY });
  
    // 블록을 병합하기 전 보드 업데이트 후 즉시 병합 수행
    const mergedBoard = mergeTetrominoToBoard({ matrix: currentTetromino, pos: { x: currentPosition.x, y: newY } });
  
    // 병합된 후 클리어 라인 적용
    const updatedBoard = clearLines(mergedBoard);
  
    // 병합된 보드를 업데이트한 후 상태를 반영
    setBoard(updatedBoard);

    // 블록 수 증가
    setBlockCount((prev) => prev + 1);
  
    // 게임 오버 체크
    if (checkGameOver(updatedBoard)) {
      setGameOver(true);
      return;  // 게임이 종료되면 새로운 블록을 생성하지 않음
    }
  
    // 4번째 블럭마다 회색 줄 추가
    if (blockCount % 4 === 0) {
      const boardWithGreyLine = riseLineFromBottom(updatedBoard);
      setBoard(boardWithGreyLine);
    }
  
    // 블럭이 내려온 후에 다시 홀드 가능하게 설정
    setCanHold(true);
  
    // 다음 블럭으로 전환
    setCurrentTetromino(generateNextTetromino());
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  
  
  };
  

  const rotateMatrix = (matrix, direction) => {
    const rotated = matrix[0].map((_, i) => matrix.map((row) => row[i]));
    return direction === 1 ? rotated.map((row) => row.reverse()) : rotated.reverse();
  };

  // 병합 함수 수정
  const mergeTetrominoToBoard = (player = { matrix: [], pos: { x: 0, y: 0 } }) => {
    const newBoard = board.map((row) => row.slice()); // 보드 복사
  
    if (!player.matrix || !player.pos) {
      console.error('Invalid player object in mergeTetrominoToBoard:', player);
      return newBoard;
    }
  
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[player.pos.y + y][player.pos.x + x] = value;
        }
      });
    });
    return newBoard;  // 병합된 보드를 반환
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
      // 라인 점수와 콤보 점수 계산
      const newLineScore = calculateLineScore(linesCleared);
      const newComboScore = calculateComboScore(linesCleared);
      
      // 점수 업데이트 및 상위 컴포넌트로 전달
      setLineScore((prevLineScore) => prevLineScore + newLineScore);
      setComboScore((prevComboScore) => prevComboScore + newComboScore);
      updateScores(lineScore + newLineScore, comboScore + newComboScore);
      
      // 빈 줄 추가
      const emptyLines = Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0));
      return [...emptyLines, ...updatedBoard];
    }
    return boardToCheck;
  };


// 라인 점수 계산 함수
const calculateLineScore = (linesCleared) => {
  return linesCleared * 100; // 1줄당 100점 예시
};

// 콤보 점수 계산 함수
const calculateComboScore = (linesCleared) => {
  return linesCleared * 10;  // 1줄 클리어 당 콤보 점수 가중치
};

  useEffect(() => {
    // 게임 보드가 변경될 때마다 점수 업데이트
    if (!gameOver) {
      updateScores(lineScore, comboScore);
    }
  }, [lineScore, comboScore, gameOver]);

  const drawGrid = (ctx) => {
    ctx.strokeStyle = "black";
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  // 저장된 블록과 교체하는 함수
  const swapHold = () => {
    if (!canHold) return; // 블록을 교체할 수 없는 경우 바로 리턴
    if (!heldBlock) {
      setHeldBlock(currentTetromino); // 현재 블록을 저장
      setCurrentTetromino(generateNextTetromino()); // 다음 블록을 가져옴
    } else {
      const temp = heldBlock;
      setHeldBlock(currentTetromino);
      setCurrentTetromino(temp);
    }
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }); // 블록 위치 초기화
    setCanHold(false); // 한번 홀드한 이후에는 다시 홀드를 사용할 수 없게 설정
  };

  // 캔버스에서 블럭을 그리는 함수
  const drawCanvasBlock = (ctx, block, xOffset = 0, yOffset = 0) => {
    block.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          drawCell(ctx, x + xOffset, y + yOffset, COLORS[value]);
        }
      });
    });
  };

  // 저장된 블럭 그리기
  useEffect(() => {
    const canvas = heldCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 캔버스 배경 색상을 #7f7f7f로 설정
    ctx.fillStyle = "#7f7f7f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid(ctx, 4, 4); // 4x4 그리드 그리기
    if (heldBlock) {
      drawCanvasBlock(ctx, heldBlock, 0, 1); // 중앙에 그리기
    }
  }, [heldBlock]);

  // 다음 블럭들 그리기
  useEffect(() => {
    const canvas = nextCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 캔버스 배경 색상을 #7f7f7f로 설정
    ctx.fillStyle = "#7f7f7f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid(ctx, 4, 12); // 4x12 그리드 그리기 (넥스트는 세로로 길게)
    nextBlocks.forEach((block, index) => {
      drawCanvasBlock(ctx, block, 0, (index * 4) + 1); // 각 블럭을 4칸씩 띄워서 그리기
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

    currentTetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          drawCell(ctx, currentPosition.x + x, currentPosition.y + y, COLORS[value]);
        }
      });
    });

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
      {gameOver && <h2>Game Over</h2>}
    </div>
  );
};

export default TetrisGame;


// 7-bag기능을 추가해 블럭(I,J,L,O,S,T,Z) 7개의 주기로 랜덤으로 블럭을 뽑아야한다.
// 쉽게 말해 7개 블록이 나오는 동안은 겹치는 블록이 없다는 뜻이다