class EnemyWatch extends Enemy
{
    MIN_WAY_POINT_DIST_SQUARE = 9
    FireRangeSquare = 300000
    ChasingRange = 500
    RotationSpeedRad = 0.02
    ViewConeAngle = 0.8

    constructor(scene, group, enemyData, obstacles,  wayPoints)
    {
        super(scene, group, enemyData, obstacles)

        this.angleRad = 0
        this.currentDirectionVector = new Phaser.Math.Vector2(1, 0)
        this.fireOnPlayer = false
        this.rotatePositiveDirection = false
        this.rayCasting = 0
    }

    move(playerSprite, ray)
    {
        if (this.rayCasting == 0)
        {
            this.rayCasting = new RayCasting(ray, this.ViewConeAngle, this.ChasingRange)
        }

        ray.setOrigin(this.sprite.x, this.sprite.y)
        
        this.fireOnPlayer = false
        this.rotatePositiveDirection = false

        var classification =  this.rayCasting.classifySearchedSpriteOnCone(this.angleRad, playerSprite)

        this.fireOnPlayer = classification != CastClassificationEnum.NotFound
        var rotDelta = this.RotationSpeedRad
        if (classification == CastClassificationEnum.CounterClockDirection)
        {
            rotDelta *= -1
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