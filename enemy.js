class Enemy extends Combatant
{
    sprite = null

    constructor(scene, enemyGroup, enemyData, obstacles)
    {
        var hitPointsMax = enemyData.properties.filter(x => x.name == 'hitPoints')[0].value

        super(hitPointsMax)

        this.hitPointsMax = hitPointsMax

        const image = enemyData.properties.filter(x => x.name == 'image')

        this.sprite = enemyGroup.create(enemyData.x, enemyData.y, image[0].value)

        this.moneyValue = 50

        var gunTemplate = {
            stats: {
                "damage": {value: 10},
                "range": {value: 450},
                "reloadDurationSec": {value: 3},
                "roundSpeed": {value: 400},
            },
            shopImage: "assets/shop_gun.png"
        }

        this.weapon = new Gun(gunTemplate)
        this.weapon.scene = scene
        this.weapon.obstacles = obstacles

        this.healthBar = this.makeBar(scene, enemyData.x, enemyData.y - this.sprite.height, 0xcc306c)

        this.isKilled = false
    }

    static multiFactory(enemies, data, scene, enemyGroup, obstacles, wayPoints)
    {        
        for (const [key, enemyData] of Object.entries(data)) 
        {
            Enemy.factory(enemies, enemyData, scene, enemyGroup, obstacles, wayPoints)
        }
    }

    static factory(enemies, enemyData, scene, enemyGroup, obstacles, wayPoints)
    {        
        var enemy = 0

        if (enemyData.name == 'base')
        {
            enemy = new Enemy(scene, enemyGroup, enemyData, obstacles)
        }
        else if (enemyData.name == 'follow')
        {
            enemy = new EnemyFollow(scene, enemyGroup, enemyData, obstacles)
        }
        else if (enemyData.name == 'waypoint')
        {
            enemy = new EnemyWayPoint(scene, enemyGroup, enemyData, obstacles, wayPoints)
        }
        else if (enemyData.name == 'watch')
        {
            enemy = new EnemyWatch(scene, enemyGroup, enemyData, obstacles, wayPoints)
        }
        else if (enemyData.name == 'barracks')
        {
            enemy = new EnemyBarracks(scene, enemyGroup, enemyData, obstacles, enemies)
        }
        else
        {
            console.error('Unknown enemy type in Enemies layer:' + value.name)
            return
        }
        
        enemies.push(enemy)
    }
    
    update(playerSprite, onRoundHitCallback, ray)
    {
        if (this.sprite.active)
        {
            if (this.hitPoints <= 0)
            {
                this.sprite.disableBody(true, true)       
                this.healthBar.destroy()         
            }
            else
            {
                this.move(playerSprite, ray)
                this.fire(this.weapon, playerSprite)    
            }
        }

        this.weapon.update(playerSprite, onRoundHitCallback)

        this.healthBar.x = this.sprite.x - this.sprite.width / 2
        this.healthBar.y = this.sprite.y - this.sprite.height
        this.healthBar.scaleX = this.hitPoints / this.hitPointsMax
    }

    move(player, ray)
    {
        var vector = new Phaser.Math.Vector2(player.x - this.sprite.x, player.y - this.sprite.y)

        vector.normalize()
        this.sprite.setRotation(vector.angle())
    }

    fire(round, player)
    {
        var x = this.sprite.x
        var y = this.sprite.y

        round.fire(x, y, player.x, player.y)
    }

    makeBar(scene, x, y, color)
    {
        //draw the bar
        let bar = scene.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, this.sprite.width, 10);
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }
}
