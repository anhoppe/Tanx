class PlayerStatsSecondaryWeapon
{
    reset()
    {
        var secondaryWeapons = []
        localStorage.secondaryWeapons = JSON.stringify(secondaryWeapons)
        localStorage.mountedSecondaryWeaponIndex = JSON.stringify(-1)
    }

    getBuyable()
    {
        return [
            {
                index: 0,
                name: "bombCarrier",
                price: 2000,
                shopImage: "assets/shop_bomb_carrier.png"
            },
            {
                index: 1,
                name: "minelayer",
                price: 1200,
                shopImage: "assets/shop_minelayer.png",
            }
        ]
    }

    getOwnedByPlayer()
    {
        var weapons = JSON.parse(localStorage.secondaryWeapons)

        var count = 0
        for (var weapon of weapons)
        {
            weapon.index = count++
        }

        return weapons
    }
    
    add(weaponName)
    {
        var secondaryWeapons = JSON.parse(localStorage.secondaryWeapons)

        secondaryWeapons.push(Weapon.FactoryFromName(weaponName))

        localStorage.secondaryWeapons = JSON.stringify(secondaryWeapons)
    }

    setMountedIndex(index)
    {
        localStorage.mountedSecondaryWeaponIndex = JSON.stringify(index)
    }

    getMountedIndex()
    {
        return parseInt(JSON.parse(localStorage.mountedSecondaryWeaponIndex))
    }
    
    getActive()
    {
        var activeWeapon = 0

        var weapons = JSON.parse(localStorage.secondaryWeapons)
        var index = parseInt(JSON.parse(localStorage.mountedSecondaryWeaponIndex))
        
        if (index != -1)
        {
            var activeWeaponTemplate = weapons[index]

            activeWeapon = Weapon.FactoryFromTemplate(activeWeaponTemplate)    
        }

        return activeWeapon
    }

}