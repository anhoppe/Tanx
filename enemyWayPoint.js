class EnemyWayPoint extends Enemy
{
    MIN_WAY_POINT_DIST_SQUARE = 9
    FireRangeSquare = 300000
    ChasingRange = 200000
    RotationSpeedRad = 0.03

    constructor(scene, group, enemyData, obstacles,  wayPoints)
    {
        super(scene, group, enemyData, obstacles)

        this.velocity = 80

        for (const [key, value] of Object.entries(wayPoints.objects))
        {
            if (enemyData.id == value.properties[0].value)
            {
                this.polyline = []
                
                // Polyline is relative to its object, thus the base position 
                // of the waypoint object has to be added to all coordinates
                for (const wayPoint of value.polyline)
                {
                    this.polyline.push(new Phaser.Math.Vector2(wayPoint.x + value.x, wayPoint.y + value.y))
                }

                this.index = 0
                this.currentWayPoint = this.getCurrentWayPoint()
            }
        }

        this.currentDirectionVector = new Phaser.Math.Vector2(1, 0)
        this.followsPlayer = false
    }

    move(playerSprite, ray)
    {
        var currentPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y)
        
        this.setupNextWayPoint(currentPos, playerSprite)

        var directionToWayPointVector = new Phaser.Math.Vector2(this.currentWayPoint)
        directionToWayPointVector.subtract(currentPos)
        directionToWayPointVector.normalize()
        this.currentDirectionVector.normalize()

        var crossProduct = this.currentDirectionVector.cross(directionToWayPointVector)

        if (crossProduct > 0)
        {
            this.currentDirectionVector.rotate(this.RotationSpeedRad)
        }
        else
        {
            this.currentDirectionVector.rotate(-this.RotationSpeedRad)
        }

        var velocityVector = new Phaser.Math.Vector2(this.currentDirectionVector)
        velocityVector.scale(this.velocity)

        this.sprite.setVelocityX(velocityVector.x)
        this.sprite.setVelocityY(velocityVector.y)
        this.sprite.setRotation(this.currentDirectionVector.angle())
    }

    fire(round, playerSprite)
    {
        var currentPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y)
        var playerPos = new Phaser.Math.Vector2(playerSprite.x, playerSprite.y)
        if (currentPos.distanceSq(playerPos) <= this.FireRangeSquare)
        {
            var x = this.sprite.x
            var y = this.sprite.y

            round.fire(x, y, x + this.currentDirectionVector.x, y + this.currentDirectionVector.y)
        }
    }

    getCurrentWayPoint()
    {
        return this.polyline[this.index]
    }

    setupNextWayPoint(currentPos, playerSprite)
    {
        var playerPos = new Phaser.Math.Vector2(playerSprite.x, playerSprite.y)

        if (currentPos.distanceSq(playerPos) <= this.ChasingRange)
        {
            this.followsPlayer = true
            this.currentWayPoint = playerPos
        }
        else
        {
            this.followsPlayer = false
            this.currentWayPoint = this.getCurrentWayPoint()
        }
        
        if (!this.followsPlayer && this.currentWayPoint.distanceSq(currentPos) <= this.MIN_WAY_POINT_DIST_SQUARE)
        {
            this.index++
            if (this.index == this.polyline.length)
            {
                this.index = 0
            }
            this.currentWayPoint = this.getCurrentWayPoint()
        }
    }
}