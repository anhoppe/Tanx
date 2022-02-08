class Player extends Combatant
{
    constructor(scene, obstacles)
    {
        var hp = PlayerStats.getHitPoints()
        super(hp)

        this.primaryGun = PlayerStats.Weapons.getActive(scene, obstacles)
        this.secondaryGun = PlayerStats.Secondary.getActive()
        
        this.playerSpriteGroup = scene.physics.add.group()

        this.baseSprite = this.playerSpriteGroup.create(0, 0, 'player_base')

        if (this.secondaryGun != 0)
        {
            this.secondaryGun.scene = scene
            this.secondaryWeaponSprite = this.playerSpriteGroup.create(0, 0, this.secondaryGun.gameImage)
            this.secondaryWeaponSprite.setCollideWorldBounds(true)
        }

        this.turretSprite = this.playerSpriteGroup.create(0, 0, this.primaryGun.gameImage)

        this.baseSprite.setCollideWorldBounds(true)
        this.turretSprite.setCollideWorldBounds(true)
        
        this.input = scene.input

        this.drivingAngleRad = 0
    }

    setPosition(posVector)
    {
        this.baseSprite.x = this.turretSprite.x = posVector.x
        this.baseSprite.y = this.turretSprite.y = posVector.y

        if (this.secondaryGun != 0)
        {
            this.secondaryWeaponSprite.x = posVector.x
            this.secondaryWeaponSprite.y = posVector.y                
        }
    }

    getPosition()
    {
        return new Phaser.Math.Vector2(this.baseSprite.x, this.baseSprite.y)
    }

    activate(startPosition)
    {
        this.setPosition(startPosition)
        this.baseSprite.visible = true
        this.turretSprite.visible = true
        if (this.secondaryGun != 0)
        {
            this.secondaryWeaponSprite.visible = true
        }
    }

    deactivate()
    {
        this.baseSprite.visible = false
        this.turretSprite.visible = false
        if (this.secondaryGun != 0)
        {
            this.secondaryWeaponSprite.visible = false
        }
        this.playerSpriteGroup.setVelocityX(0)
        this.playerSpriteGroup.setVelocityY(0)
    }

    move(enemyGroup, onRoundHitCallback)
    {
        if (this.hitPoints <= 0)
        {
            this.baseSprite.disableBody(true, true)
            this.turretSprite.disableBody(true, true)
            if (this.secondaryGun != 0)
            {
                this.secondaryWeaponSprite.disableBody(true, true)
            }
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

            if (this.secondaryGun != 0)
            {
                this.secondaryWeaponSprite.setRotation(this.drivingAngleRad)
            }

            this.playerSpriteGroup.setVelocityX(-Math.cos(this.drivingAngleRad) * velocityY)
            this.playerSpriteGroup.setVelocityY(-Math.sin(this.drivingAngleRad) * velocityY)
        }

        this.primaryGun.update(enemyGroup, onRoundHitCallback)
        
        if (this.secondaryGun != 0)
        {
            this.secondaryGun.update(enemyGroup, onRoundHitCallback)
        }
    }

    fire()
    {
        if (this.input.mousePointer.leftButtonDown() && this.playerSpriteGroup.active)
        {
            var angleRad = this.getTurretAngleRad()
            var toX =  Math.sin(angleRad) * 200
            var toY = -Math.cos(angleRad) * 200

            this.primaryGun.fire(this.baseSprite.x, this.baseSprite.y, this.baseSprite.x + toX, this.baseSprite.y + toY)
        }

        if (this.input.mousePointer.rightButtonDown() && this.playerSpriteGroup.active && this.secondaryGun != 0)
        {
            this.secondaryGun.fire(this.baseSprite.x, this.baseSprite.y, this.baseSprite.x + toX, this.baseSprite.y + toY)
        }

        var space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        if (space.isDown && this.secondaryGun != 0)
        {
            this.secondaryGun.alternativeFire()
        }
    }

    getTurretAngleRad()
    {
        let angleDeg = -(this.input.mousePointer.x / 2) % 360
        return angleDeg / 180 * Math.PI
    }
}
