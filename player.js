class Player extends Combatant
{
    roundFiring = false;
    roundSpeed = 500

    constructor(scene, obstacles, startPosition)
    {
        var hp = PlayerStats.getHitPoints()
        super(hp)

        this.playerSpriteGroup = scene.physics.add.group()

        this.baseSprite = this.playerSpriteGroup.create(0, 0, 'player_base')
        this.turretSprite = this.playerSpriteGroup.create(0, 0, 'player_turret')

        this.baseSprite.setCollideWorldBounds(true)
        this.turretSprite.setCollideWorldBounds(true)

        this.input = scene.input
        this.round = new Round(scene, obstacles, PlayerStats.getShootDelaySec(), PlayerStats.getRoundDamage())

        this.drivingAngleRad = 0
    }

    setPosition(posVector)
    {
        this.baseSprite.x = this.turretSprite.x = posVector.x
        this.baseSprite.y = this.turretSprite.y = posVector.y
    }

    move(enemyGroup, onRoundHitCallback)
    {
        if (this.hitPoints <= 0)
        {
            this.baseSprite.disableBody(true, true)
            this.turretSprite.disableBody(true, true)
        }
        else
        {
            var keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
            var keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
            var keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
            var keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)

            var velocityY = 0
        
            if (keyW.isDown)
            {
                velocityY -= 160
            }
        
            if (keyS.isDown)
            {
                velocityY += 160
            }

            if (keyA.isDown)
            {
                this.drivingAngleRad -= PlayerStats.getPlayerRotationSpeedRad()
            }

            if (keyD.isDown)
            {
                this.drivingAngleRad += PlayerStats.getPlayerRotationSpeedRad()
            }
        
            var angleRad = this.getTurretAngleRad()
            this.turretSprite.setRotation(angleRad)
        
            this.baseSprite.setRotation(this.drivingAngleRad)

            this.playerSpriteGroup.setVelocityX(-Math.sin(this.drivingAngleRad) * velocityY)
            this.playerSpriteGroup.setVelocityY(Math.cos(this.drivingAngleRad) * velocityY)
        }

        this.round.update(enemyGroup, onRoundHitCallback)
    }

    fire()
    {
        if (this.input.mousePointer.isDown && this.playerSpriteGroup.active)
        {
            var angleRad = this.getTurretAngleRad()
            var toX =  Math.sin(angleRad) * 200
            var toY = -Math.cos(angleRad) * 200

            this.round.fire(this.baseSprite.x, this.baseSprite.y, this.baseSprite.x + toX, this.baseSprite.y + toY)
        }
    }

    getTurretAngleRad()
    {
        let angleDeg = -(this.input.mousePointer.x / 2) % 360
        return angleDeg / 180 * Math.PI
    }
}