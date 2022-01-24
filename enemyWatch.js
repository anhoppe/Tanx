class EnemyWatch extends Enemy
{
    MIN_WAY_POINT_DIST_SQUARE = 9
    FireRangeSquare = 300000
    ChasingRange = 200000
    RotationSpeedRad = 0.03

    constructor(scene, group, enemyData, obstacles,  wayPoints)
    {
        super(scene, group, enemyData, obstacles)

        this.angleRad = 0
        this.currentDirectionVector = new Phaser.Math.Vector2(1, 0)
    }

    move(playerSprite, ray)
    {
        ray.setOrigin(this.sprite.x, this.sprite.y)
        //set ray's cone angle (in radians)
        ray.setCone(0.8)

        // ray.enablePhysics();
        // ray.setCollisionRange(50)
        //set ray's cone angle (in degrees)
        // ray.setConeDeg(90)

        ray.setAngle(this.angleRad)

        //cast rays in a cone
        let intersections = ray.castCone();

        StatusScene.RayHit = ""
        
        for (var intersection of intersections)
        {
            if (intersection.object === playerSprite)
            {
                StatusScene.RayHit = "Player hit"
                break
            }
        }

        this.angleRad += this.RotationSpeedRad
        this.currentDirectionVector.rotate(this.RotationSpeedRad)

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
}