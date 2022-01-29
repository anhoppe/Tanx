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
        this.load.image('soldier', 'assets/soldier.png')
        this.load.image('gun', 'assets/gun.png')

        this.load.spritesheet('player_base', 'assets/player_base.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player_turret', 'assets/player_turret.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player_rearGun', 'assets/player_rearGun.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player_spreadGun', 'assets/player_spreadGun.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 32, frameHeight: 32 });

        this.load.image('hq', 'assets/hq.png')

        this.load.image('ground', 'assets/ground.png')
        this.load.image('world', 'assets/world.png')
        this.load.image('weaponCollision', 'assets/weaponCollision.png')

        this.load.image('sky', 'assets/sky.png')

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

        // Setup ground
        const groundTileset = map.addTilesetImage('ground', 'ground')
        this.ground = map.createLayer('ground', groundTileset)

        // Setup world (Contains non-collision objects and objects the combatants can collide with)
        const worldTileset = map.addTilesetImage('world', 'world')
        this.world = map.createLayer('world', worldTileset)
        this.world.setCollisionByProperty({ collides: true })
        this.raycaster.mapGameObjects(this.world, false, {
            collisionTiles: this.world.layer.collideIndexes
        })

        // Setup weapon collision (contains tiles the round AND the combatants can collide with)
        const weaponCollisionTileset = map.addTilesetImage('weaponCollision', 'weaponCollision')
        this.weaponCollision = map.createLayer('weaponCollision', weaponCollisionTileset)
        this.weaponCollision.setCollisionByProperty({ collides: true })

        // Setup sky level
        const skyTileset = map.addTilesetImage('sky', 'sky')
        this.sky = map.createLayer('sky', skyTileset)
        this.sky.setDepth(10)

        // Create player with camera
        this.player = new Player(this, this.weaponCollision)
        PlayerStats.Player = this.player

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player.baseSprite);
        this.cameras.main.zoom = 2;

        // Player collision
        this.physics.add.collider(this.player.playerSpriteGroup, this.world, null, null, this);
        this.physics.add.collider(this.player.playerSpriteGroup, this.weaponCollision, null, null, this);

        // Create HQ + HQ Meno
        this.hq = new Hq(this, map, this.player)
        this.raycaster.mapGameObjects(this.hq.hqSprite)
        
        // Create waypoints for enemies
        const wayPoints = map.getObjectLayer('Waypoints')

        // Create enemies
        this.enemies = []
        this.enemyGroup = this.physics.add.group()
        const enemyData = map.getObjectLayer('Enemies').objects
        Enemy.factory(this.enemies, enemyData, this, this.enemyGroup, this.weaponCollision, wayPoints)
        this.physics.add.collider(this.enemyGroup, this.world);
        this.physics.add.collider(this.enemyGroup, this.weaponCollision);
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        this.hq.setupCollision(this.physics, this.enemyGroup)
        this.physics.add.collider(this.enemyGroup, this.hq.hqSprite)

        // World bounds
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

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
