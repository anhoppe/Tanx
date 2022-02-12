class PlayerStatsAmmo
{
    reset()
    {
        var ammunition = []
        localStorage.ammunition = JSON.stringify(ammunition)
        localStorage.selectedSecondaryWeaponAmmoIndex = JSON.stringify(-1)
    }
    
    getBuyable()
    {
        return [
            {
                index: 0,
                name: "triggerBombSmall",
                price: 500,
                shopImage: "assets/shop_trigger_bomb_small.png",
                weaponType: "bombCarrier",
                radius: 128,
                damage: 500,
                type: 'trigger'
            },
            {
                index: 1,
                name: "timedBombSmall",
                price: 200,
                shopImage: "assets/shop_timed_bomb_small.png",
                weaponType: "bombCarrier",
                type: 'time',
                radius: 128,
                damage: 500,
                durationSec: 5
            },
            {
                index: 2,
                name: "mine",
                price: 200,
                shopImage: "assets/shop_mine.png",
                weaponType: "minelayer",
                type: 'direct',
                damage: 120,
                units: 10
            },
            {
                index: 3,
                name: "mine",
                price: 500,
                shopImage: "assets/shop_mine.png",
                weaponType: "minelayer",
                type: 'direct',
                damage: 120,
                units: 20
            },
            {
                index: 4,
                name: "mine",
                price: 500,
                shopImage: "assets/shop_mine_area_damage.png",
                weaponType: "minelayer",
                type: 'area',
                radius: 128,
                damage: 100,
                units: 5
            }
        ]
    }

    getOwnedByPlayer()
    {
        var ammunition = JSON.parse(localStorage.ammunition)

        var count = 0
        for (var ammo of ammunition)
        {
            ammo.index = count++
        }

        return ammunition
    }

    
    decUnitCount(index)
    {
        var ammunition = JSON.parse(localStorage.ammunition)

        ammunition[index].units--

        localStorage.ammunition = JSON.stringify(ammunition)
    }


    add(ammoTemplateIndex)
    {
        var ammunition = JSON.parse(localStorage.ammunition)

        var ammoTemplates = PlayerStats.Ammo.getBuyable()

        ammunition.push(ammoTemplates[ammoTemplateIndex])

        localStorage.ammunition = JSON.stringify(ammunition)
    }

    getSelectedSecondaryWeaponAmmoIndex()
    {
        return JSON.parse(localStorage.selectedSecondaryWeaponAmmoIndex)
    }

    setSelectedSecondaryWeaponAmmoIndex(index)
    {
        localStorage.selectedSecondaryWeaponAmmoIndex = JSON.stringify(index)
    }

    removeSecondaryWeaponAmmoByIndex(index)
    {
        if (index != -1)
        {
            var ammunition = JSON.parse(localStorage.ammunition)
            ammunition.splice(index, 1)
            localStorage.ammunition = JSON.stringify(ammunition)
        }
    }

    getSelected()
    {
        var ammo = PlayerStats.Ammo.getOwnedByPlayer()

        var index = PlayerStats.Ammo.getSelectedSecondaryWeaponAmmoIndex()

        if (index != -1)
        {
            return ammo[index]
        }

        return 0
    }
}