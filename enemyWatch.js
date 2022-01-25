class EnemyWatch extends Enemy
{
    MIN_WAY_POINT_DIST_SQUARE = 9
    FireRangeSquare = 300000
    ChasingRange = 200000
    RotationSpeedRad = 0.01
    ViewConeAngle = 0.8

    constructor(scene, group, enemyData, obstacles,  wayPoints)
    {
        super(scene, group, enemyData, obstacles)

        this.angleRad = 0
        this.currentDirectionVector = new Phaser.Math.Vector2(1, 0)
        this.fireOnPlayer = false
        this.rotatePositiveDirection = false
    }

    move(playerSprite, ray)
    {
        ray.setOrigin(this.sprite.x, this.sprite.y)
        

        this.fireOnPlayer = false
        this.rotatePositiveDirection = false

        for (var index = 0; index < 10; index++)
        {
            var angle = this.angleRad - this.ViewConeAngle / 2 +  this.ViewConeAngle / 10 * index
            
            ray.setAngle(angle)
            let intersection = ray.cast();
            if (intersection.object === playerSprite)
            {
                this.fireOnPlayer = true
                if (index > 5)
                {
                    this.rotatePositiveDirection = true
                }
            }
        }

        var rotDelta = this.RotationSpeedRad

        if (this.fireOnPlayer)
        {
            if (!this.rotatePositiveDirection)
            {
                rotDelta *= -1
            }
        }

        this.angleRad += rotDelta
        this.currentDirectionVector.rotate(rotDelta)

        this.sprite.setRotation(this.currentDirectionVector.angle())
    }

    fire(round, playerSprite)
    {
        if (this.fireOnPlayer)
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
    }
}