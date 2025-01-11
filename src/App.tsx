import { useEffect } from "react";
import gameConfig from "./utils/gameConfig";
import Phaser from "phaser";
import "./App.css";

function App() {
	useEffect(() => {
		const game = new Phaser.Game(gameConfig);

		return () => {
			game.destroy(true);
		};
	}, []);

	return (
		<div className="flex flex-col items-center justify-center">
			<div id="phaser-game" className="text-center"></div>
		</div>
	);
}

export default App;
