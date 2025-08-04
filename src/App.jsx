import React from 'react'
import './App.css'
import Dices from './Dices.jsx'
import Confetti from 'react-confetti'

export default function App() {
	const [dices, setDices] = React.useState(() => generateNewDices())
	const buttonRef = React.useRef(null)
	const allHeld = dices.every(dice => dice.isHeld) && dices.every(dice => dice.value === dices[0].value)

	const [windowSize, setWindowSize] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

	React.useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight
			});
		}
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);


	React.useEffect(() => {
		if(allHeld) {
			buttonRef.current.focus()
		}
	}, [allHeld])

	function generateNewDices(){
		return new Array(10)
		.fill(0)
		.map((_, index) => ({
			id: index,                  
			value: Math.ceil(Math.random() * 6),
			isHeld: false
			}) 
		)
	}

	const diceElements = dices.map(dice => {
		return (
			<Dices value={dice.value}
			key={dice.id}
			isHeld={dice.isHeld}
			hold={() => holdDice(dice.id)}
			/>  
		)
	})

	function rollDices() { 
		if(allHeld){
			setDices(generateNewDices())
			return
		}
		setDices(oldDices => oldDices.map(dice => {
			return dice.isHeld ? dice :
			{...dice, value: Math.ceil(Math.random() * 6)}
		}))
	}

	function holdDice(id) {
		setDices(oldDices => oldDices.map(dice => {
			return dice.id !== id ? dice :
			{...dice, isHeld: !dice.isHeld}
		}))
	}

	 return (
		<main>
			{allHeld && <Confetti
				width={windowSize.width}
				height={windowSize.height}
			/>}
			<div aria-live="polite" className='sr-only'>
				{allHeld && <p>Congratulations! You won! Press "New Game" to start again.</p>}
			</div>
			<h1 className='title'>Tenzies</h1>
			<p className='instructions'>Roll until all dice are the same. Click each die to freeze
			it at its current value between rolls.
			</p>
			<div className='dice-container'>
				 {diceElements}
			</div>
			<button ref={buttonRef} className='roll-dices' onClick={rollDices}>{allHeld ? "New Game" : "Roll"}</button>
			{allHeld && <p className='win-message'>You won! Press "New Game" to start again.</p>}
		</main>
	 )
} 