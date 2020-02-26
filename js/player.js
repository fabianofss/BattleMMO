function cria_jogador(){
	// cria jogador no centro da tela
    player = game.add.sprite(game.width / 2, game.height / 2, 'mago');
	// define o centro do player como area fisica
    player.anchor.x = 0.5;
	player.anchor.y = 1;
	
    // a camera deve seguir o jogador
	game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);
	// Habilita a fisica do tipo P2, NINJA ou ARCADE
	game.physics.enable(player, Phaser.Physics.P2);	
	
	// HP do jogador
	player.health = 100;
	player.force = 10;
	
	//criando as animações
	player.animations.add('andando-c', [ 20, 21, 22, 23, 24, 25, 26, 27], 10, false);
	player.animations.add('andando-b', [ 10, 11, 12, 13, 14, 15, 16, 17], 10, false);
	player.animations.add('parado-c', [ 5, 6, 7, 8, 9], 10, true);
	player.animations.add('parado-b', [ 0, 1, 2, 3, 4], 10, true);
	player.animations.add('ataque-c', [ 40, 41, 42, 43, 44, 45, 46], 10, false);
	player.animations.add('ataque-b', [ 30, 31, 32, 33, 34, 35, 36], 10, false);
	
	// Vamos usar uma variavel para controlar a posição que o player está voltado
	direcao = -1;
	// Quando não estiver executadno animação executa uma animação para parado
	player.events.onAnimationComplete.add(animacaoParado, this);
	
	player.play('parado-b');
}

function animacaoParado(){
	if (direcao < 0){player.play('parado-b');}
	else {player.play('parado-c');}
}


function comandos_jogador(){
	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		if (direcao < 0){player.play('ataque-b');}
		else {player.play('ataque-c');}
		// Verifica a distancia do poring e do jogador
		for(var i = 0; i < nrPorings; i++){
			if(poring[i].position.distance(player.position) < 50){
				//poring[i].play('p-ataque-b');
				poring[i].health -= player.inputPower;
				if(!poring[i].alive){
					poring[i].body.velocity.y = 0;
					poring[i].animations.play('die', 2, false, true);
				}
				alert(player.inputPower);
			}
		}
	}	
	else if (cursors.left.isDown){
			player.x -= velocidade;
			player.scale.x = 1;
			if (direcao < 0){player.play('andando-b');}
			else {player.play('andando-c');}
    }
    else if (cursors.right.isDown){
			player.x += velocidade;
			player.scale.x = -1;
			if (direcao < 0){player.play('andando-b');}
			else {player.play('andando-c');}
    }
	else if (cursors.up.isDown){
		if (direcao < 0){direcao = 0;}		
		if (player.y > 0){player.y -= velocidade;}
		if (direcao < 0){player.play('andando-b');}
		else {player.play('andando-c');}
    }
    else if (cursors.down.isDown){
		if (direcao >= 0){direcao = -1;}		
		if (player.y < 500){player.y += velocidade;}
		if (direcao < 0){player.play('andando-b');}
		else {player.play('andando-c');}
    }
}