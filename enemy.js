class Enemy extends Combatant
{
    sprite = null
    round = null

    constructor(scene, group, enemyData, obstacles)
    {
        var hitPointsMax = enemyData.properties.filter(x => x.name == 'hitPoints')[0].value

        super(hitPointsMax)

        this.hitPointsMax = hitPointsMax

        const image = enemyData.properties.filter(x => x.name == 'image')

        this.sprite = group.create(enemyData.x, enemyData.y, image[0].value)

        this.moneyValue = 50

        this.round = new Round(scene, obstacles, 3, 10)

        this.healthBar = this.makeBar(scene, enemyData.x, enemyData.y - this.sprite.height, 0xcc306c)
    }

    static factory(enemies, data, scene, group, obstacles, wayPoints)
    {        
        for (const [key, enemyData] of Object.entries(data)) 
        {
            var enemy = 0

            if (enemyData.name == 'base')
            {
                enemy = new Enemy(scene, group, enemyData, obstacles)
            }
            else if (enemyData.name == 'follow')
            {
                enemy = new EnemyFollow(scene, group, enemyData, obstacles)
            }
            else if (enemyData.name == 'waypoint')
            {
                enemy = new EnemyWayPoint(scene, group, enemyData, obstacles, wayPoints)
            }
            else
            {
                console.error('Unknown enemy type in Enemies layer:' + value.name)
                continue
            }
            
            enemies.push(enemy)
        }
    }
    
    update(playerSprite, onRoundHitCallback)
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
                this.move(playerSprite)
                this.fire(this.round, playerSprite)    
            }
        }

        this.round.update(playerSprite, onRoundHitCallback)

        this.healthBar.x = this.sprite.x - this.sprite.width / 2
        this.healthBar.y = this.sprite.y - this.sprite.height
        this.healthBar.scaleX = this.hitPoints / this.hitPointsMax
    }

    move(player)
    {
        var vector = new Phaser.Math.Vector2(player.x - this.sprite.x, player.y - this.sprite.y)

        vector.normalize()
        this.sprite.setRotation(vector.angle())
    }

    fire(round, player)
    {
        if (!round.isFiring())
        {
            var x = this.sprite.x
            var y = this.sprite.y

            round.fire(x, y, player.x, player.y)
        }
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
