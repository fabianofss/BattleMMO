var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

var player, posicao, direcao, teste, playerHP;
var nrPorings = 1;
var poringHP = [];
var text, text2;
var poringGoup;

function preload() {
    // Load images to use as the game sprites
    game.load.image('posicao', 'assets/objetos/star3.png');
    game.load.spritesheet('mago', 'assets/sprites/Mage.png', 80, 128, 66);
    game.load.spritesheet('poring', 'assets/sprites/Poring.png', 60, 70, 66);
}

function create() {
	text = game.add.text(10, 10, "Log", { font: "12px Arial", fill: "#ffff44"});
	text2 = game.add.text(10, 20, "Log", { font: "12px Arial", fill: "#ffff44"});
	cria_player();
	//cria_poring();
	cria_grupo();
}

function update() {	

    // direção vector é a direção em linha reta do peixe ao alvo
    direcao = new Phaser.Point(posicao.x, posicao.y);
    // agora nós subtrair a posição peixe atual
    direcao.subtract(player.x, player.y);
    
    // Agora vamos adicionar direção peixe a atual velocidade peixe
    player.body.velocity.add(direcao.x, direcao.y);
    // vamos definir a magnitude para construir a velocidade
    player.body.velocity.setMagnitude(player.speed);
    
    if(player.position.distance(posicao.position) < 1){
        player.body.velocity.normalize();
		if (player.animations.currentAnim.name == 'andando'){player.play('parado');}
    }
	
	// Faz a barra de hp acompanhar o player
	playerHP.setPosition(player.x, player.y + 10);
	
    for (var i = 0; i < poringGoup.length; i++){
        var poring = poringGoup.children[i];
		
		text.text = 'Poring: ' + poring.animations.currentAnim.name + ' <<';
		text2.text = 'Player: ' + player.animations.currentAnim.name + ' <<';
		
        // direção vector é a direção em linha reta do peixe ao alvo
        var direcao_p = new Phaser.Point(player.x, player.y);
        // agora nós subtrair a posição peixe atual
        direcao_p.subtract(poring.x, poring.y);
        
        // Agora vamos adicionar direção peixe a atual velocidade peixe
        poring.body.velocity.add(direcao_p.x, direcao_p.y);
        // vamos definir a magnitude para construir a velocidade
        poring.body.velocity.setMagnitude(poring.speed);
		
		// Faz a barra de hp acompanhar o player
		poringHP[i].setPosition(poring.x, poring.y + 20);
		if (poring.x < player.x){poring.scale.x = -1;}
		else{poring.scale.x = 1;}

		if (poring.alive){
			if(poring.position.distance(player.position) < 50){
				// poring para de andar
				poring.body.velocity.normalize();
				// poring começa a atacar
				if (poring.animations.currentAnim.name != 'p-ataque'){poring.play('p-ataque');}
				
				// player fica voltado para o poring que está atacando
				if (player.x < poring.x){player.scale.x = -1;}
				else{player.scale.x = 1;}
				
				// player tbm deve atacar
				if (player.animations.currentAnim.name != 'ataque'){player.play('ataque');}
				function update() {    if (poringGoup.countLiving() > 0)        updateTimer();}
				// Atacando o poring
				if (player.animations.currentAnim.name == 'ataque' && player.animations.currentAnim.frame == 36){
					// baixando hp do poring
					poringHP[i].healthValue -= player.force;
					var percentHP = ((poringHP[i].healthValue / poring.health) * 100);
					poringHP[i].setPercent(percentHP);

					// se zerar o hp o player morre
					if (poringHP[i].healthValue <= 0){poring.kill(); poringHP[i].kill();player.play('parado');}
				}
				
				// Atacando o player
				if (poring.animations.currentAnim.name == 'p-ataque' && poring.animations.currentAnim.frame == 36){
					// baixando hp do player
					playerHP.healthValue -= poring.force;
					var percentHP = ((playerHP.healthValue / player.health) * 100);
					text.text = percentHP;
					poringHP[i].setPercent(percentHP);
					// se zerar o hp o player morre
					if (playerHP.healthValue <= 0){player.kill(); playerHP.kill();poring.play('p-parado');}
				}
		   }
		   else{poring.play('p-parado');}
        }
		
    }
}

function dragUpdate() {
    player.play('andando');
	if (player.x < posicao.x){player.scale.x = -1;}
	else{player.scale.x = 1;}    
}

function cria_grupo() {
    //  Here we'll create a new Group
    poringGoup = game.add.group();
	
    //  And add 10 sprites to it
    for (var i = 0; i < nrPorings; i++){
        var randomPoint = new Phaser.Point(game.rnd.between(0, game.width -1), game.rnd.between(0, game.height - 1));
		var tempSprite = game.add.sprite(randomPoint.x, randomPoint.y, "poring");

		// Atribuindo fisica ao poring
        game.physics.enable(tempSprite, Phaser.Physics.ARCADE);		
		
        tempSprite.name = 'poring' + i;
		tempSprite.health = 100;
        tempSprite.anchor.set(0.5);
		// Criando velocidade aleatória entre 50 e 150
        tempSprite.speed = game.rnd.between(20, 40);
		// Criando força aleatória entre 5 e 25
        tempSprite.force = game.rnd.between(1, 5);

		// Cria barra de hp do poring
		var barConfig = {width: 60, height: 10, x: 200, y: 100};
		poringHP[i] = new HealthBar(this.game, barConfig);
		poringHP[i].healthValue = tempSprite.health;	
		
        poringGoup.add(tempSprite);
    }
	
    //  Now using the power of callAll we can add the same animation to all coins in the group:
    poringGoup.callAll('animations.add', 'animations', 'p-andando', [0, 1, 2, 3], 10, true);
    poringGoup.callAll('animations.add', 'animations', 'p-parado', [0, 1, 2, 3], 10, true);
    poringGoup.callAll('animations.add', 'animations', 'p-ataque', [30, 31, 36], 10, true);
	
    //  And play them
    poringGoup.callAll('animations.play', 'animations', 'p-andando');	
	
}

function cria_player() {
	// cria jogador no centro da tela
    player = game.add.sprite(game.width / 2, game.height / 2, 'mago');
	// Habilita a fisica do tipo P2, NINJA ou ARCADE
	game.physics.enable(player, Phaser.Physics.ARCADE);	
	// define o centro do player como area fisica
	player.anchor.set(0.5, 1);

	// Atributos
	player.name   = 'Herak';
	player.health = 100;
	player.speed  = 60;
	player.force  = 10;
	
	player.animations.add('andando', [ 10, 11, 12, 13, 14, 15, 16, 17], 10, true);
	player.animations.add('parado', [ 0, 1, 2, 3, 4], 10, true);
	player.animations.add('ataque', [ 30, 31, 32, 33, 34, 35, 36], 10, true);
	// Quando não estiver executadno animação executa uma animação para parado
	player.events.onAnimationComplete.add(animacaoParado, this);
	player.play('parado');
	
    // Cria a posição que o player deve tomar
    posicao = game.add.sprite(player.x, player.y, 'posicao');
    posicao.anchor.x = posicao.anchor.y = 0.5 ;
    posicao.inputEnabled = true ; // habilita interação com o mouse
    posicao.input.enableDrag(true); // habilita arrastar com o mouse
    posicao.events.onDragUpdate.add(dragUpdate); // enquanto arrasta
	
	// Cria barra de hp do player
	var barConfig = {width: 80, height: 10, x: 200, y: 100};
    playerHP = new HealthBar(this.game, barConfig);
	playerHP.healthValue = player.health;	
}

function animacaoParado(){
	player.play('parado');
}