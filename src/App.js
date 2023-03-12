import logo from './logo.svg';
import './App.css';
import Board from './Board';
import Square from './Square';
import {useState, useEffect} from 'react';

const defaultSquares = () => (new Array(9)).fill(null);
const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4 ,7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6], 
];
function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  useEffect(() => {
    const isComputerTurn = squares.filter(square => square !== null).length % 2 === 1;
    const linesThatAre = (a, b, c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => squares[index]);
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      })
    };
    const emptyIndexes = squares
    .map((square, index) => square === null ? index : null)
      .filter(val => val !== null);
    const playerWon =  linesThatAre('x', 'x', 'x').length > 0;
    const computerWon = linesThatAre('o', 'o', 'o').length > 0;
    if (playerWon) {
      setWinner('x');
    }
    if (computerWon) {
      setWinner('o');
    }
    const putComputer = index => {
      let newSquares = squares;
      newSquares[index] = 'o';
      setSquares([...newSquares]);
    };
    if (isComputerTurn) {
      // Winning conditions for computer
      const winningLines = linesThatAre('o', 'o', null);
      if (winningLines.length > 0) {
        const winPos = winningLines[0].filter(index => squares[index] === null)[0];
        putComputer(winPos);
        return;
      }
      // Block conditions when enemies have two point in a row
      const linesToBlock = linesThatAre('x', 'x', null);
      if (linesToBlock.length > 0) {
        const blockPos = linesToBlock[0].filter(index => squares[index] === null)[0];
        putComputer(blockPos);
        return;
      }
      
      // Continue conditions when you have a point in a row and have no threats and no chances to win in one move
      const linesToContinue = linesThatAre('o', null, null);
      if (linesToContinue.length > 0) {
        putComputer(linesToContinue[0].filter(index => squares[index] === null)[0]);
        return;
      }
      const randomIndex = emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      putComputer(randomIndex);
    }

  },[squares])
  function handleSquareClick(index) {
    const isPlayerTurn = squares.filter(square => square !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newSquares = squares;
      newSquares[index] = 'x';
      setSquares([...newSquares]);
    }
    
  }

  return (
    <main>
      <Board>
        {squares.map((square, index) => 
          <Square 
            key={index}
            x={square==='x'?1:0}
            o={square==='o'?1:0}
            onClick={() => handleSquareClick(index)} 
          />
        )}
      </Board>
      {winner && winner === 'x' && (
        <div className = 'result player'>YOU WON!</div>
      )}
      {winner && winner === 'o' && (
        <div className="result computer">YOU LOST!</div>
      )}
    </main>
  );
}

export default App;
