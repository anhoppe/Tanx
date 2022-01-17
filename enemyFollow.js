class EnemyFollow extends Enemy
{
    _velocity = 80

    constructor(scene, group, enemyData, obstacles)
    {
        super(scene, group, enemyData, obstacles)
        this.avoidObstacle = false

        this.lastAvoidObstaclesTimeSec = 0
    }

    move(player, ray)
    {
        if (!this.avoidObstacle)
        {
            this.vector = new Phaser.Math.Vector2(player.x - this.sprite.x, player.y - this.sprite.y)
            var enemyPlayerDistSquare = this.vector.lengthSq()

            this.vector.normalize()

            // Check if there is an obstacle between enemy and player
            ray.setOrigin(this.sprite.x, this.sprite.y)
            var angle = Math.acos(this.vector.x)
            ray.setAngle(angle)
            var intersection = ray.cast()
            var hitSegment = intersection.segment
            if (typeof hitSegment !== 'undefined' && this.isMinTimeElapsed())
            {
                // Check if intersection is closer then player
                var vectorToHit = new Phaser.Math.Vector2(intersection.x - this.sprite.x, intersection.y - this.sprite.y)

                if (vectorToHit.lengthSq() < enemyPlayerDistSquare)
                {
                    // Check which hit segment point is closer to the player and go for that direction
                    const enemyToHitSegmentStartVector = new Phaser.Math.Vector2(hitSegment.x1 - this.sprite.x, hitSegment.y1 - this.sprite.y)
                    const enemyToHitSegmentEndVector = new Phaser.Math.Vector2(hitSegment.x2 - this.sprite.x, hitSegment.y2 - this.sprite.y)

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
    
                this.sprite.setVelocityX(this.vector.x)
                this.sprite.setVelocityY(this.vector.y)
                this.sprite.setRotation(this.vector.angle())    
            }
        }

        if (this.avoidObstacle)
        {
            // Check if there is still an obstacle between enemy and player
            ray.setOrigin(this.sprite.x, this.sprite.y)
            var toPlayerVector = new Phaser.Math.Vector2(player.x - this.sprite.x, player.y - this.sprite.y)
            var distEnemyToPlayerSquare = toPlayerVector.lengthSq()
            toPlayerVector.normalize()
            const angle = Math.acos(toPlayerVector.x)
            ray.setAngle(angle)
            toPlayerVector = new Phaser.Math.Vector2(player.x - this.sprite.x, player.y - this.sprite.y)

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
                var vectorToHit = new Phaser.Math.Vector2(intersection.x - this.sprite.x, intersection.y - this.sprite.y)
                if (distEnemyToPlayerSquare < vectorToHit.lengthSq())
                {
                    abortBecausePlayerIsNotBehindObstacleAnymore = true
                }                
            }

            this.vector = new Phaser.Math.Vector2(this.currentTarget.x - this.sprite.x, this.currentTarget.y - this.sprite.y)
            if (this.vector.lengthSq() < 50 || abortBecausePlayerIsNotBehindObstacleAnymore)
            {
                this.avoidObstacle = false
                this.lastAvoidObstaclesTimeSec = Date.now() / 1000
            }
            else
            {
                this.vector.normalize()
                this.vector.scale(this._velocity)
    
                this.sprite.setVelocityX(this.vector.x)
                this.sprite.setVelocityY(this.vector.y)
                this.sprite.setRotation(this.vector.angle())    
            }
        }
    }

    fire(round, player)
    {
        var x = this.sprite.x
        var y = this.sprite.y

        round.fire(x, y, x + this.vector.x, y + this.vector.y)
    }

    isMinTimeElapsed()
    {
        var currentTimeSec = Date.now() / 1000
        return (currentTimeSec - this.lastAvoidObstaclesTimeSec) > 5 ? true : false
    }
}
