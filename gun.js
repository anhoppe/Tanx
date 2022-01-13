class Gun extends Weapon
{

    constructor(template)
    {
        super("gun", template)
    }

    emitShot(physics, xFrom, yFrom, xTo, yTo)
    {
        var sprite = physics.add.sprite(xFrom, yFrom, 'round')
        physics.moveTo(sprite, xTo, yTo, this.stats["roundSpeed"].value)
        var startPos = new Phaser.Math.Vector2(xFrom, yFrom)

        return [[startPos, sprite]]
    }
}
