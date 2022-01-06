class EnemyFollow extends Enemy
{
    _velocity = 80

    constructor(scene, group, enemyData, obstecals)
    {
        super(scene, group, enemyData, obstecals)
    }

    move(player)
    {
        var vector = new Phaser.Math.Vector2(player.x - this.sprite.x, player.y - this.sprite.y)

        vector.normalize()
        vector.scale(this._velocity)

        this.sprite.setVelocityX(vector.x)
        this.sprite.setVelocityY(vector.y)
        this.sprite.setRotation(vector.angle())
    }
}
