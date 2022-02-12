class PlayerStatsWeapons
{
    reset()
    {
        var weapons = [Weapon.FactoryFromName("gun")]
        localStorage.primaryWeapons = JSON.stringify(weapons)
        localStorage.mountedPrimaryWeaponIndex = JSON.stringify(0)
    }

    getBuyable()
    {
        return [
            {
                index: 0,
                name: "gun",
                price: 200,
                shopImage: "assets/shop_gun.png"
            },
            {
                index: 1,
                name: "rearGun",
                price: 500,
                shopImage: "assets/shop_rearGun.png"
            },
            {
                index: 2,
                name: "spreadGun",
                price: 1000,
                shopImage: "assets/shop_spread_gun.png"
            },
        ]
    }

    getOwnedByPlayer()
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)

        var count = 0
        for (var weapon of weapons)
        {
            weapon.index = count++
        }

        return weapons
    }

    add(name)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)

        weapons.push(Weapon.FactoryFromName(name))
     
        localStorage.primaryWeapons = JSON.stringify(weapons)
    }

    getByIndex(index)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)
        
        return weapons[index]
    }

    setMountedIndex(index)
    {
        localStorage.mountedPrimaryWeaponIndex = JSON.stringify(index)
    }

    getMountedIndex()
    {
        return parseInt(JSON.parse(localStorage.mountedPrimaryWeaponIndex))
    }

    getActive(scene, obstacles)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)
        var index = parseInt(JSON.parse(localStorage.mountedPrimaryWeaponIndex))
        var activeWeaponTemplate = weapons[index]

        var activeWeapon = Weapon.FactoryFromTemplate(activeWeaponTemplate)
        activeWeapon.scene = scene
        activeWeapon.obstacles = obstacles

        return activeWeapon
    }
    
    upgrade(index, statName)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)
        var weapon = weapons[index]
        var oldStats = weapon.stats[statName]
        weapon.stats[statName] = {value: oldStats.value + oldStats.incLevel, incCount: oldStats.incCount+1, incLevel: oldStats.incLevel, basePrice: oldStats.basePrice}
        localStorage.primaryWeapons = JSON.stringify(weapons)
    }
}
