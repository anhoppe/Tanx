class RearGun extends Weapon
{
    constructor(template)
    {
        super("rearGun", template)
    }

    emitShot(physics, xFrom, yFrom, xTo, yTo)
    {
        var sprite = physics.add.sprite(xFrom, yFrom, 'round')
        physics.moveTo(sprite, xTo, yTo, this.stats["roundSpeed"].value)
        var startPos = new Phaser.Math.Vector2(xFrom, yFrom)

        var vec = new Phaser.Math.Vector2(xTo - xFrom, yTo - yFrom)
        vec.scale(-1)

        var sprite2 = physics.add.sprite(xFrom, yFrom, 'round')
        physics.moveTo(sprite2, xFrom + vec.x, yFrom + vec.y, this.stats["roundSpeed"].value)
        var startPos2 = new Phaser.Math.Vector2(xFrom, yFrom)

        return [[startPos, sprite], [startPos2, sprite2]]
    }
}