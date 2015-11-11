/// <reference path="Arkanoid.ts"/>

import ark = Arkanoid.ArkanoidGame;
import Config = Arkanoid.Config;

var game = new ark("game");


//var config = new Config(Arkanoid.GameLevel.Three, 2, 0.2, 0.2, 10);
var config = Config.getDefaultConfig();
config.currentGameLevel = Arkanoid.GameLevel.Three;

game.newGame(config);
