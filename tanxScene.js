// A true Straction game

class TanxScene extends Phaser.Scene
{
    constructor(config)
    {
        super(config)
        Phaser.Scene.call(this, {key:'scene', active: true})
    }

    preload()
    {
        this.load.html('hqWarMenu', 'assets/hqWarMenu.html')
        this.load.image('round', 'assets/round.png')
    
        this.load.image('brum-boss', 'assets/brum_boss.png')
        this.load.image('enemy', 'assets/enemy.png')
        this.load.image('turret', 'assets/turret.png')
        this.load.image('gun', 'assets/gun.png')

        this.load.spritesheet('player_base', 'assets/player_base.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player_turret', 'assets/player_turret.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player_rearGun', 'assets/player_rearGun.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player_spreadGun', 'assets/player_spreadGun.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 32, frameHeight: 32 });

        this.load.image('hq', 'assets/hq.png')

        this.load.image('background', 'assets/background.png')
        this.load.image('obstacles', 'assets/obstacles.png')

        var fileName = 'assets/level' + PlayerStats.getCurrentLevel() + '.json' 
        this.load.tilemapTiledJSON('tilemap', fileName)
    }
    
    create()
    {
        // Create raycaster
        this.raycaster = this.raycasterPlugin.createRaycaster();
        this.ray = this.raycaster.createRay();

        // Create animations for explosion
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });

        // create the Tilemap
        const map = this.make.tilemap({ key: 'tilemap' })

        // add the tileset image we are using
        const backgroundTileset = map.addTilesetImage('background', 'background')
        
        // Create background layer
        map.createLayer('Background', backgroundTileset)

        // Create obstacle layer
        const obstacleTileset = map.addTilesetImage('obstacles', 'obstacles');
        this.obstacles = map.createLayer('Obstacles', obstacleTileset);
        this.obstacles.setCollisionByExclusion([-1]);
        this.raycaster.mapGameObjects(this.obstacles, false, {
            collisionTiles: this.obstacles.layer.collideIndexes
        })

        // Create player with camera
        this.player = new Player(this, this.obstacles)
        PlayerStats.Player = this.player

        this.cameras.main.setBounds(0, 0, 100*64, 100*64);
        this.cameras.main.startFollow(this.player.baseSprite);
        this.cameras.main.zoom = 2;
        this.physics.add.collider(this.player.playerSpriteGroup, this.obstacles, null, null, this);

        // Create HQ + HQ Meno
        this.hq = new Hq(this, map, this.player)
        this.raycaster.mapGameObjects(this.hq.hqSprite)
        
        // Create waypoints for enemies
        const wayPoints = map.getObjectLayer('Waypoints')

        // Create enemies
        this.enemies = []
        this.enemyGroup = this.physics.add.group()
        const enemyData = map.getObjectLayer('Enemies').objects
        Enemy.factory(this.enemies, enemyData, this, this.enemyGroup, this.obstacles, wayPoints)
        this.physics.add.collider(this.enemyGroup, this.obstacles);
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.hq.setupCollision(this.physics, this.enemyGroup)
        this.physics.add.collider(this.enemyGroup, this.hq.hqSprite)

        // World bounds
        this.physics.world.setBounds(0, 0, 100*64, 100*64)

        // Hide mouse pointer
        this.sys.canvas.style.cursor = 'none'
    }
    
    update()
    {
        if (!this.hq.isActive())
        {
            this.player.move(this.enemyGroup, (sprite, damage) => {
                this.enemies.forEach(enemy => {
                    if (enemy.sprite === sprite)
                    {
                        enemy.takeDamage(damage)
                    }
                })
            })
        }

        this.player.fire()

        this.hq.displayMenuOnCollision(this.physics, this.player)


        this.updateEnemies()
        this.checkGameFinished()
    }

    updateEnemies()
    {
        let enemyForDeletion = []

        this.enemies.forEach(enemy => {
            enemy.update(this.player.baseSprite, (sprite, damage) => {
                if (!this.hq.isActive())
                {
                    this.player.takeDamage(damage)
                }
            }, this.ray)

            if (!enemy.sprite.active)
            {
                enemyForDeletion.push(enemy)
                PlayerStats.addMoney(enemy.moneyValue)
            }
        })

        this.enemies = this.enemies.filter(item => !enemyForDeletion.includes(item))
    }

    checkGameFinished()
    {
        if (this.enemies == 0)
        {
            PlayerStats.incMaxLevelReached()

            this.game.destroy(true, true)
            this.enemies = []
            location.href = "main.html";
        }

        if (!this.player.baseSprite.active)
        {
            location.href = "main.html";
        }
    }
}
