class EnemyWayPoint extends Enemy
{
    MIN_WAY_POINT_DIST_SQUARE = 9

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
    }

    move(player)
    {
        var currentPos = new Phaser.Math.Vector2(this.sprite.x, this.sprite.y)
        if (this.currentWayPoint.distanceSq(currentPos) <= this.MIN_WAY_POINT_DIST_SQUARE)
        {
            this.index++
            if (this.index == this.polyline.length)
            {
                this.index = 0
            }
            this.currentWayPoint = this.getCurrentWayPoint()
        }

        var vector = new Phaser.Math.Vector2(this.currentWayPoint)
        vector.subtract(currentPos)

        vector.normalize()
        vector.scale(this.velocity)

        this.sprite.setVelocityX(vector.x)
        this.sprite.setVelocityY(vector.y)
        this.sprite.setRotation(vector.angle())
    }

    getCurrentWayPoint()
    {
        return this.polyline[this.index]
    }
}