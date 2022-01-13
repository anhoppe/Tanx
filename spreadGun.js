class SpreadGun extends Weapon
{
    constructor(template)
    {
        super("spreadGun", template)
    }

    emitShot(physics, xFrom, yFrom, xTo, yTo)
    {
        var sprite = physics.add.sprite(xFrom, yFrom, 'round')
        physics.moveTo(sprite, xTo, yTo, this.stats["roundSpeed"].value)
        var startPos = new Phaser.Math.Vector2(xFrom, yFrom)

        var vec = new Phaser.Math.Vector2(xTo - xFrom, yTo - yFrom)
        vec.normalize()

        vec.rotate(0.6)

        var sprite2 = physics.add.sprite(xFrom, yFrom, 'round')
        physics.moveTo(sprite2, xFrom + vec.x, yFrom + vec.y, this.stats["roundSpeed"].value)
        var startPos2 = new Phaser.Math.Vector2(xFrom, yFrom)

        vec.rotate(-1.2)
        var sprite3 = physics.add.sprite(xFrom, yFrom, 'round')
        physics.moveTo(sprite3, xFrom + vec.x, yFrom + vec.y, this.stats["roundSpeed"].value)
        var startPos3 = new Phaser.Math.Vector2(xFrom, yFrom)

        return [[startPos, sprite], [startPos2, sprite2], [startPos3, sprite3]]
    }
}