class EnemyFollow extends Enemy
{
    _velocity = 80

    constructor(scene, group, enemyData, obstecals)
    {
        super(scene, group, enemyData, obstecals)
    }

    move(player)
    {
        this.vector = new Phaser.Math.Vector2(player.x - this.sprite.x, player.y - this.sprite.y)

        this.vector.normalize()
        this.vector.scale(this._velocity)

        this.sprite.setVelocityX(this.vector.x)
        this.sprite.setVelocityY(this.vector.y)
        this.sprite.setRotation(this.vector.angle())
    }

    fire(round, player)
    {
        if (!round.isFiring())
        {
            var x = this.sprite.x
            var y = this.sprite.y

            round.fire(x, y, x + this.vector.x, y + this.vector.y)
        }
    }

}
