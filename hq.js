var hq_global_variable = 0

class Hq
{
    constructor(scene, hqObject, player)
    {
        this.hqMenu = scene.add.dom(hqObject.x, hqObject.y).createFromCache('hqWarMenu');
        this.hqMenu.setPerspective(800)
        this.hqMenu.visible = false
        this.hqMenu.getChildByProperty("id", "repairButton").innerHTML = "Repair Tank (" + PlayerStats.getRepairKitCount() + " units left)"

        this.hqMenu.on('click', function (event) {
    
            if (event.target.id === 'repairButton')
            {
                PlayerStats.useRepairKit()
                hq_global_variable.hqMenu.getChildByProperty("id", "repairButton").innerHTML = "Repair Tank (" + PlayerStats.getRepairKitCount() + " units left)"
            }
            else if (event.target.id === 'armSecondaryWeapon')
            {
                var ammos = PlayerStats.getAllAmmoOwnedByPlayer()

                var selectedSecondaryWeapon = PlayerStats.getActiveSecondaryWeapon()

                var index = 0
                for (var ammo of ammos)
                {
                    if (ammo.weaponType == selectedSecondaryWeapon.type)
                    {
                        PlayerStats.setSelectedSecondaryWeaponAmmoIndex(index)
                        break
                    }

                    index++
                }
            }
            else if (event.target.id === 'leaveButton')
            {
                //  Turn off the click events
                hq_global_variable.hqMenu.removeListener('click');
                hq_global_variable.hqMenu.visible = false

                player.activate(hq_global_variable.playerStartPosition)
            }
        });

        this.hqSpriteGroup = scene.physics.add.staticGroup()
        this.hqSprite = this.hqSpriteGroup.create(hqObject.x, hqObject.y, 'hq')

        this.playerStartPosition = new Phaser.Math.Vector2(hqObject.x, hqObject.y - hqObject.height)
        player.setPosition(this.playerStartPosition)

        hq_global_variable = this
    }

    setupCollision(physics, spriteGroup)
    {
        physics.add.collider(this.hqSpriteGroup, spriteGroup)
    }

    displayMenuOnCollision(physics, player)
    {
        physics.add.overlap(player.baseSprite, this.hqSprite, (playerSprite, hqSprite) => {
            this.hqMenu.addListener('click');
            this.hqMenu.visible = true
            player.deactivate()
        })
    }

    isActive()
    {
        return this.hqMenu.visible
    }
}
