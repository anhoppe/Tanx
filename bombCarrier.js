class BombCarrier extends Weapon
{
    constructor(template)
    {
        super("bombCarrier", template)

        this.droppedBomb = 0
        this.droppedBombSprite = 0
        this.applyDamageToEnemiesOnUpdate = false
    }

    update(combatantGroup, onRoundHitCallback)
    {
        if (this.applyDamageToEnemiesOnUpdate)
        {
            this.applyDamageToEnemiesOnUpdate = false

            for (var combatantSprite of combatantGroup.children.entries)
            {
                const dist = new Phaser.Math.Vector2(this.xExplosion - combatantSprite.x, this.yExplosion - combatantSprite.y)

                if (dist.lengthSq() < this.explosionRadius * this.explosionRadius)
                {
                    onRoundHitCallback(combatantSprite, this.explosionDamage)
                }
            }
        }
    }

    fire(xFrom, yFrom, xTo, yTo)
    {
        var selectedAmmoIndex = PlayerStats.getSelectedSecondaryWeaponAmmoIndex()

        if (selectedAmmoIndex != -1)
        {
            var ammos = PlayerStats.getAllAmmoOwnedByPlayer()
            this.droppedBomb = ammos[selectedAmmoIndex]
            this.droppedBombSprite = this.scene.add.sprite(xFrom, yFrom, this.droppedBomb.name)

            PlayerStats.removeSecondaryWeaponAmmoByIndex(selectedAmmoIndex)
            PlayerStats.setSelectedSecondaryWeaponAmmoIndex(-1)
        }
    }

    alternativeFire()
    {
        if (this.droppedBomb != 0)
        {
            var explosion = this.scene.physics.add.sprite(this.droppedBombSprite.x, this.droppedBombSprite.y, 'bombExplosionSmall');
            explosion.anims.play('bombExplosionSmall', true)
            explosion.on('animationcomplete', () => {
                    this.applyDamageToEnemiesOnUpdate = true
                    explosion.destroy()
                }
            )

            this.droppedBombSprite.destroy()
            this.explosionDamage = this.droppedBomb.damage
            this.explosionRadius = this.droppedBomb.radius
            this.xExplosion = this.droppedBombSprite.x
            this.yExplosion = this.droppedBombSprite.y
            this.droppedBomb = 0
            this.droppedBombSprite = 0
        }
    }
}
