class EnemyFollow extends Enemy
{
    _velocity = 80

    constructor(scene, group, enemyData, obstacles)
    {
        super(scene, group, enemyData, obstacles)
        this.avoidObstacle = false

        this.lastAvoidObstaclesTimeSec = 0
    }

    move(playerSprite, ray)
    {
        if (!this.avoidObstacle)
        {
            this.vector = new Phaser.Math.Vector2(playerSprite.x - this.baseSprite.x, playerSprite.y - this.baseSprite.y)
            var enemyPlayerDistSquare = this.vector.lengthSq()

            this.vector.normalize()

            // Check if there is an obstacle between enemy and player
            ray.setOrigin(this.baseSprite.x, this.baseSprite.y)
            var angle = Math.acos(this.vector.x)
            ray.setAngle(angle)
            var intersection = ray.cast()
            var hitSegment = intersection.segment
            if (typeof hitSegment !== 'undefined' && this.isMinTimeElapsed())
            {
                // Check if intersection is closer then player
                var vectorToHit = new Phaser.Math.Vector2(intersection.x - this.baseSprite.x, intersection.y - this.baseSprite.y)

                if (vectorToHit.lengthSq() < enemyPlayerDistSquare)
                {
                    // Check which hit segment point is closer to the player and go for that direction
                    const enemyToHitSegmentStartVector = new Phaser.Math.Vector2(hitSegment.x1 - this.baseSprite.x, hitSegment.y1 - this.baseSprite.y)
                    const enemyToHitSegmentEndVector = new Phaser.Math.Vector2(hitSegment.x2 - this.baseSprite.x, hitSegment.y2 - this.baseSprite.y)

                    var newTargetVector;

                    if (enemyToHitSegmentStartVector.lengthSq() < enemyToHitSegmentEndVector.lengthSq())
                    {
                        var hitSegmentVector = new Phaser.Math.Vector2(hitSegment.x1 - hitSegment.x2, hitSegment.y1 - hitSegment.y2)
                        hitSegmentVector.normalize()
                        hitSegmentVector.scale(150)
                        newTargetVector = new Phaser.Math.Vector2(hitSegment.x1 + hitSegmentVector.x, hitSegment.y1 + hitSegmentVector.y)    
                    }
                    else
                    {
                        var hitSegmentVector = new Phaser.Math.Vector2(hitSegment.x2 - hitSegment.x1, hitSegment.y2 - hitSegment.y1)
                        hitSegmentVector.normalize()
                        hitSegmentVector.scale(150)
                        newTargetVector = new Phaser.Math.Vector2(hitSegment.x2 + hitSegmentVector.x, hitSegment.y2 + hitSegmentVector.y)    
                    }

                    // set a new target point for the enemy
                    this.currentTarget = new Phaser.Math.Vector2(newTargetVector.x, newTargetVector.y)
                    this.avoidObstacle = true
                }
            }

            if (!this.avoidObstacle)
            {
                this.vector.scale(this._velocity)
    
                this.baseSprite.setVelocityX(this.vector.x)
                this.baseSprite.setVelocityY(this.vector.y)
                this.baseSprite.setRotation(this.vector.angle())    
            }
        }

        if (this.avoidObstacle)
        {
            // Check if there is still an obstacle between enemy and player
            ray.setOrigin(this.baseSprite.x, this.baseSprite.y)
            var toPlayerVector = new Phaser.Math.Vector2(playerSprite.x - this.baseSprite.x, playerSprite.y - this.baseSprite.y)
            var distEnemyToPlayerSquare = toPlayerVector.lengthSq()
            toPlayerVector.normalize()
            const angle = Math.acos(toPlayerVector.x)
            ray.setAngle(angle)
            toPlayerVector = new Phaser.Math.Vector2(playerSprite.x - this.baseSprite.x, playerSprite.y - this.baseSprite.y)

            const intersection = ray.cast()
            var hitSegment = intersection.segment
            var abortBecausePlayerIsNotBehindObstacleAnymore = false

            // no object hit in player directory - enemy can interrupt avoiding the obstacle
            if (typeof hitSegment === 'undefined')
            {
                abortBecausePlayerIsNotBehindObstacleAnymore = true
            }
            else
            {
                var vectorToHit = new Phaser.Math.Vector2(intersection.x - this.baseSprite.x, intersection.y - this.baseSprite.y)
                if (distEnemyToPlayerSquare < vectorToHit.lengthSq())
                {
                    abortBecausePlayerIsNotBehindObstacleAnymore = true
                }                
            }

            this.vector = new Phaser.Math.Vector2(this.currentTarget.x - this.baseSprite.x, this.currentTarget.y - this.baseSprite.y)
            if (this.vector.lengthSq() < 50 || abortBecausePlayerIsNotBehindObstacleAnymore)
            {
                this.avoidObstacle = false
                this.lastAvoidObstaclesTimeSec = Date.now() / 1000
            }
            else
            {
                this.vector.normalize()
                this.vector.scale(this._velocity)
    
                this.baseSprite.setVelocityX(this.vector.x)
                this.baseSprite.setVelocityY(this.vector.y)
                this.baseSprite.setRotation(this.vector.angle())    
            }
        }
    }

    fire(round, player)
    {
        var x = this.baseSprite.x
        var y = this.baseSprite.y

        round.fire(x, y, x + this.vector.x, y + this.vector.y)
    }

    isMinTimeElapsed()
    {
        var currentTimeSec = Date.now() / 1000
        return (currentTimeSec - this.lastAvoidObstaclesTimeSec) > 5 ? true : false
    }
}
