
class Round
{
    _roundSpeed = 400
    _roundFiring = false
    shotDelaySec = 100
    _lastFireTimeSec = 0
    _shotDistanceSquare = 250000
    _startPos = null

    constructor(scene, obstacles, shotDelaySec, damage)
    {
        this.scene = scene
        this.obstacles = obstacles
        this.shotDelaySec = shotDelaySec
        this.damage = damage
    }

    isFiring()
    {
        return this._roundFiring
    }

    fire(xFrom, yFrom, xTo, yTo)
    {
        if (this.isMinTimeElapsed())
        {
            this._lastFireTimeSec = Date.now() / 1000
            this._roundFiring = true
            this.roundSprite = this.scene.physics.add.sprite(xFrom, yFrom, 'round')
            this.scene.physics.moveTo(this.roundSprite, xTo, yTo, this._roundSpeed)
            this._startPos = new Phaser.Math.Vector2(xFrom, yFrom)
            this.scene.physics.add.collider(this.roundSprite, this.obstacles, (round, obstacle) => 
            {
                round.destroy()
                this._roundFiring = false

                this.setExplosion(round)
        }, null, this.scene)

        }
    }

    update(combatantGroup, onRoundHitCallback)
    {
        if (this.roundSprite != null)
        {
            var vec = new Phaser.Math.Vector2(this.roundSprite.x, this.roundSprite.y)
            if (vec.distanceSq(this._startPos) > this._shotDistanceSquare)
            {
                this._roundFiring = false
                this.roundSprite.destroy()
            }

            var worldBounds = this.scene.physics.world.bounds
            if(this.roundSprite.x > worldBounds.width || this.roundSprite.y > worldBounds.height || this.roundSprite.x < 0 || this.roundSprite.y < 0)
            {
                this._roundFiring = false
                this.roundSprite.destroy()
            }

            this.scene.physics.add.overlap(this.roundSprite, combatantGroup, (round, combatantSprite) => 
                { 
                    round.destroy()
                    this._roundFiring = false

                    this.setExplosion(round)

                    onRoundHitCallback(combatantSprite, this.damage)
                }, null, this.scene)
        }
    }

    isMinTimeElapsed()
    {
        var currentTimeSec = Date.now() / 1000
        return (currentTimeSec - this._lastFireTimeSec) > this.shotDelaySec ? true : false
    }

    setExplosion(round)
    {
        var explosion = this.scene.physics.add.sprite(round.x, round.y, 'explosion');
        explosion.anims.play('explosion', true)
        explosion.on('animationcomplete', () => explosion.destroy())
    }
}
