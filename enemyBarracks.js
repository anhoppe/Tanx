class EnemyBarracks extends Enemy
{
    RotationSpeedRad = 0.005
    SpawnFreqSec = 3

    constructor(scene, enemyGroup, enemyData, obstacles, enemies)
    {
        super(scene, enemyGroup, enemyData, obstacles)

        this.enemyGroup = enemyGroup
        this.enemies = enemies
        this.scene = scene
        this.obstacles = obstacles
        this.angleRad = 0
        this.lastSpawnTimeSec = 0
        this.coneAngleRad = 0.6
        this.viewDistance = 420
        this.rayCasting = 0

        this.polygon = 0
    }

    move(playerSprite, ray)
    {
        if (this.hitPoints < 0)
        {
            return
        }

        if (this.rayCasting == 0)
        {
            this.rayCasting = new RayCasting(ray, this.coneAngleRad, this.viewDistance, 50)
        }

        ray.setOrigin(this.sprite.x, this.sprite.y)

        if (this.polygon != 0)
        {
            this.polygon.destroy()
        }

        var points = this.rayCasting.getConeColisionPoints(this.angleRad)

        if (points.length != 0)
        {
            points.push({
                x: this.sprite.x,
                y: this.sprite.y
            })
            this.polygon = this.scene.add.polygon(0, 0, points, 0xFFF78E, 124)
            this.polygon.setOrigin(0, 0)
        }

        var classification = this.rayCasting.classifySearchedSpriteOnCone(this.angleRad, playerSprite)

        if (classification != CastClassificationEnum.NotFound && this.isMinTimeElapsed())
        {
            const spawnEnemyCount = 5

            for (var index = 0; index < spawnEnemyCount; index++)
            {
                var soldierData = this.getSoldierTemplate(this.sprite.x + 100, this.sprite.y - spawnEnemyCount / 2 * 60 + index * 60 )

                Enemy.factory(this.enemies, soldierData, this.scene, this.enemyGroup, this.obstacles, null)
            }

            this.lastSpawnTimeSec = Date.now() / 1000
        }

        this.angleRad += this.RotationSpeedRad
    }

    fire(round, player)
    {
        // Barracks don't fire
    }

    takeDamage(damage)
    {
        this.hitPoints -= damage

        if (this.hitPoints < 0)
        {
            if (this.polygon != 0)
            {
                this.polygon.destroy()
                this.polygon = 0
            }            
        }
    }

    getSoldierTemplate(x, y)
    {
        return {
            name: 'follow',
            x: x,
            y: y,
            properties: [
                {
                    name: 'hitPoints',
                    value: '30'
                },
                {
                    name: 'image',
                    value: 'enemy'
                }
            ]
        }
    }

    isMinTimeElapsed()
    {
        var currentTimeSec = Date.now() / 1000
        return (currentTimeSec - this.lastSpawnTimeSec) > this.SpawnFreqSec ? true : false
    }
}