class Minelayer extends Weapon
{
    constructor(template)
    {
        super("minelayer", template)
        this.droppedMines = []
        this.lastFireTimeSec = 0
    }
    
    update(combatantGroup, onRoundHitCallback)
    {
        for (var droppedMinePair of this.droppedMines)
        {
            var droppedMine = droppedMinePair[0]
            var droppedMineSprite = droppedMinePair[1]

            if (this.scene.physics.overlap(droppedMineSprite, combatantGroup, (mine, combatantSprite) => 
            { 
                if (droppedMine.type == "direct")
                {
                    onRoundHitCallback(combatantSprite, droppedMine.damage)                    
                }
            }, null, this.scene))
            {
                if (droppedMine.type == "direct")
                {
                    this.setDirectExplosion(droppedMineSprite)
                    droppedMine.removeMine = true

                }
                else
                {
                    this.setAreaExplosion(droppedMine, droppedMineSprite)
                }
                droppedMineSprite.destroy()
            }

            if (droppedMine.hasOwnProperty('explosionAnimation'))
            {
                // Currently the isPlaying property is used to define when the impact of the bomb
                // is applied to the combatants
                if (!droppedMine.explosionAnimation.anims.isPlaying)
                {
                    for (var combatantSprite of combatantGroup.children.entries)
                    {
                        const dist = new Phaser.Math.Vector2(droppedMineSprite.x - combatantSprite.x, droppedMineSprite.y - combatantSprite.y)
        
                        if (dist.lengthSq() < droppedMine.radius * droppedMine.radius)
                        {
                            onRoundHitCallback(combatantSprite, droppedMine.damage)
                        }
                    }

                    droppedMine.explosionAnimation.destroy()
                    droppedMine.removeMine = true
                }
            }

        }

        if (this.droppedMines.length > 0)
        {
            this.droppedMines = this.droppedMines.filter(x => !x[0].removeMine)
        }
    }

    fire(xFrom, yFrom, xTo, yTo)
    {
        var selectedAmmoIndex = PlayerStats.getSelectedSecondaryWeaponAmmoIndex()

        if (selectedAmmoIndex != -1 && this.isMinTimeElapsed())
        {
            this.lastFireTimeSec = Date.now() / 1000

            var droppedMine = PlayerStats.getSelectedAmmo()

            droppedMine.isExploding = false
            droppedMine.removeMine = false

            var droppedMineSprite = this.scene.physics.add.sprite(xFrom, yFrom, droppedMine.name)
            this.droppedMines.push([droppedMine, droppedMineSprite])

            PlayerStats.decAmmoUnitCount(selectedAmmoIndex)
            droppedMine.units -= 1

            if (droppedMine.units == 0)
            {
                PlayerStats.removeSecondaryWeaponAmmoByIndex(selectedAmmoIndex)
                PlayerStats.setSelectedSecondaryWeaponAmmoIndex(-1)    
            }
        }
    }

    setDirectExplosion(mine)
    {
        var explosion = this.scene.physics.add.sprite(mine.x, mine.y, 'explosion');
        explosion.anims.play('explosion', true)
        explosion.on('animationcomplete', () => explosion.destroy())
    }

    setAreaExplosion(droppedMine, droppedMineSprite)
    {
        droppedMine.isExploding = true

        var explosion = this.scene.physics.add.sprite(droppedMineSprite.x, droppedMineSprite.y, 'bombExplosionSmall');
        explosion.anims.play('bombExplosionSmall', true)

        droppedMine.explosionAnimation = explosion

        droppedMineSprite.destroy()
    }

    isMinTimeElapsed()
    {
        var currentTimeSec = Date.now() / 1000
        return (currentTimeSec - this.lastFireTimeSec) > this.stats["mineDropDelaySec"].value ? true : false
    }
}