class BombCarrier extends Weapon
{
    constructor(template)
    {
        super("bombCarrier", template)

        this.droppedBombs = []
    }

    update(combatantGroup, onRoundHitCallback)
    {
        for (var droppedBombPair of this.droppedBombs)
        {
            var droppedBomb = droppedBombPair[0]
            var droppedBombSprite = droppedBombPair[1]

            this.checkTimeBombDurationExpired(droppedBomb, droppedBombSprite)
            
            this.terminateExplodingBombs(droppedBomb, droppedBombSprite, combatantGroup, onRoundHitCallback)
        }

        if (this.droppedBombs.length > 0)
        {
            this.droppedBombs = this.droppedBombs.filter(x => !x[0].removeBomb)
        }
    }

    fire(xFrom, yFrom, xTo, yTo)
    {
        var selectedAmmoIndex = PlayerStats.getSelectedSecondaryWeaponAmmoIndex()

        if (selectedAmmoIndex != -1)
        {
            var ammos = PlayerStats.getAllAmmoOwnedByPlayer()
            var droppedBomb = ammos[selectedAmmoIndex] 

            droppedBomb.isExploding = false
            droppedBomb.removeBomb = false

            var droppedBombSprite = this.scene.add.sprite(xFrom, yFrom, droppedBomb.name)

            if (droppedBomb.type == 'time')
            {
                droppedBomb.startTimeSec = Date.now() / 1000
            }
            
            this.droppedBombs.push([droppedBomb, droppedBombSprite])

            PlayerStats.removeSecondaryWeaponAmmoByIndex(selectedAmmoIndex)
            PlayerStats.setSelectedSecondaryWeaponAmmoIndex(-1)
        }
    }

    alternativeFire()
    {
        for (var droppedBombPair of this.droppedBombs)
        {
            var droppedBomb = droppedBombPair[0]
            var droppedBombSprite = droppedBombPair[1]

            if (droppedBomb.type == 'trigger' && !droppedBomb.isExploding)
            {
                this.triggerExplosion(droppedBomb, droppedBombSprite)
            }
        }
    }

    checkTimeBombDurationExpired(droppedBomb, droppedBombSprite)
    {
        if (droppedBomb.type == 'time' && !droppedBomb.isExploding)
        {
            const timeNowSec = Date.now() / 1000

            if (timeNowSec - droppedBomb.startTimeSec > droppedBomb.durationSec)
            {
                this.triggerExplosion(droppedBomb, droppedBombSprite)
            }
        }
    }

    terminateExplodingBombs(droppedBomb, droppedBombSprite, combatantGroup, onRoundHitCallback)
    {
        if (droppedBomb.hasOwnProperty('explosionAnimation'))
        {
            // Currently the isPlaying property is used to define when the impact of the bomb
            // is applied to the combatants
            if (!droppedBomb.explosionAnimation.anims.isPlaying)
            {
                for (var combatantSprite of combatantGroup.children.entries)
                {
                    const dist = new Phaser.Math.Vector2(droppedBombSprite.x - combatantSprite.x, droppedBombSprite.y - combatantSprite.y)
    
                    if (dist.lengthSq() < droppedBomb.radius * droppedBomb.radius)
                    {
                        onRoundHitCallback(combatantSprite, droppedBomb.damage)
                    }
                }

                droppedBomb.explosionAnimation.destroy()
                droppedBomb.removeBomb = true
            }
        }
    }

    triggerExplosion(droppedBomb, droppedBombSprite)
    {
        droppedBomb.isExploding = true

        var explosion = this.scene.physics.add.sprite(droppedBombSprite.x, droppedBombSprite.y, 'bombExplosionSmall');
        explosion.anims.play('bombExplosionSmall', true)

        droppedBomb.explosionAnimation = explosion

        droppedBombSprite.destroy()
    }
}
