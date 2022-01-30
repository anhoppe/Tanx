class PlayerStats
{
    // Reference to the player instance in TanxScene is used to track the current hit points
    static Player = 0

    // Absolute number of levels that are available
    static TotalLevelCount = 4

    static reset()
    {
        localStorage.maxLevelReached = JSON.stringify(1)
        localStorage.currentLevel = JSON.stringify(1)
        localStorage.money = JSON.stringify(10000)
        localStorage.hitPoints = JSON.stringify(50)
        localStorage.rotationSpeedRad = JSON.stringify(0.02)
        localStorage.repairKitCount = JSON.stringify(0)

        var weapons = [Weapon.FactoryFromName("gun")]
        localStorage.primaryWeapons = JSON.stringify(weapons)
        localStorage.mountedPrimaryWeaponIndex = JSON.stringify(0)

        var secondaryWeapons = []
        localStorage.secondaryWeapons = JSON.stringify(secondaryWeapons)
        localStorage.mountedSecondaryWeaponIndex = JSON.stringify(-1)

        var ammunition = []
        localStorage.ammunition = JSON.stringify(ammunition)
        localStorage.selectedSecondaryWeaponAmmoIndex = JSON.stringify(-1)
    }

    static getMoney()
    {
        return JSON.parse(localStorage.money)
    }

    static addMoney(value)
    {
        localStorage.money = JSON.stringify(JSON.parse(localStorage.money) + value)
    }

    static removeMoney(amount)
    {
        localStorage.money = JSON.stringify(JSON.parse(localStorage.money) - amount)
    }
    
    static getCurrentLevel()
    {
        return JSON.parse(localStorage.currentLevel)
    }

    static setCurrentLevel(index)
    {
        localStorage.currentLevel = JSON.stringify(index)
    }

    static getMaxLevelReached()
    {
        return JSON.parse(localStorage.maxLevelReached)
    }
    
    static incMaxLevelReached()
    {
        var levelCount = JSON.parse(localStorage.maxLevelReached)
        
        if (PlayerStats.getCurrentLevel() == levelCount && levelCount < PlayerStats.TotalLevelCount)
        {
            localStorage.maxLevelReached = JSON.stringify(levelCount + 1)
        }
    }

    static getHitPoints()
    {
        return JSON.parse(localStorage.hitPoints)
    }

    static getHitPointsInPerCent()
    {
        return 100 * PlayerStats.Player.hitPoints / PlayerStats.getHitPoints();
    }

    static getPlayerRotationSpeedRad()
    {
        return JSON.parse(localStorage.rotationSpeedRad)
    }

    // Deprecated
    static getShootDelaySec()
    {
        return JSON.parse(localStorage.shootDelaySec)
    }

    // Deprecated
    static getCostsShootDelayDecrease()
    {
        var currentDelySec = JSON.parse(localStorage.shootDelaySec)

        if (currentDelySec > 0.5)
        {
            return Math.pow(10 * (4 - currentDelySec), 2)
        }

        return -1
    }

    static getAllTanksOwnedByPlayer()
    {
        return [
            {
                index: 0,
                name: "ant",
                shopImage: "assets/shop_tank_ant.png"
            }
        ]
    }

    static getAllWeaponsOwnedByPlayer()
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)

        var count = 0
        for (var weapon of weapons)
        {
            weapon.index = count++
        }

        return weapons
    }

    static getAllSecondaryWeaponsOwnedByPlayer()
    {
        var weapons = JSON.parse(localStorage.secondaryWeapons)

        var count = 0
        for (var weapon of weapons)
        {
            weapon.index = count++
        }

        return weapons
    }

    static getAllAmmoOwnedByPlayer()
    {
        var ammunition = JSON.parse(localStorage.ammunition)

        var count = 0
        for (var ammo of ammunition)
        {
            ammo.index = count++
        }

        return ammunition
    }

    static addWeapon(weaponName)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)

        weapons.push(Weapon.FactoryFromName(weaponName))
     
        localStorage.primaryWeapons = JSON.stringify(weapons)
    }

    static addSecondaryWeapon(weaponName)
    {
        var secondaryWeapons = JSON.parse(localStorage.secondaryWeapons)

        secondaryWeapons.push(Weapon.FactoryFromName(weaponName))

        localStorage.secondaryWeapons = JSON.stringify(secondaryWeapons)
    }

    static addAmmo(ammoTemplateIndex)
    {
        var ammunition = JSON.parse(localStorage.ammunition)

        var ammoTemplates = PlayerStats.getBuyableAmmunition()

        ammunition.push(ammoTemplates[ammoTemplateIndex])

        localStorage.ammunition = JSON.stringify(ammunition)
    }

    static getBuyableWeapons()
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

    static getBuyableSecondaryWeapons()
    {
        return [
            {
                index: 0,
                name: "bombCarrier",
                price: 2000,
                shopImage: "assets/shop_bomb_carrier.png"
            }
        ]
    }

    static getBuyableAmmunition()
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
                radius: 128,
                damage: 500,
                type: 'time',
                durationSec: 5
            }
        ]
    }

    static getWeaponByIndex(index)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)
        
        return weapons[index]
    }

    static setMountedPrimaryWeaponIndex(index)
    {
        localStorage.mountedPrimaryWeaponIndex = JSON.stringify(index)
    }

    static setMountedSecondaryWeaponIndex(index)
    {
        localStorage.mountedSecondaryWeaponIndex = JSON.stringify(index)
    }

    static setSelectedSecondaryWeaponAmmoIndex(index)
    {
        localStorage.selectedSecondaryWeaponAmmoIndex = JSON.stringify(index)
    }

    static getActiveWeapon(scene, obstacles)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)
        var index = parseInt(JSON.parse(localStorage.mountedPrimaryWeaponIndex))
        var activeWeaponTemplate = weapons[index]

        var activeWeapon = Weapon.FactoryFromTemplate(activeWeaponTemplate)
        activeWeapon.scene = scene
        activeWeapon.obstacles = obstacles

        return activeWeapon
    }

    static getActiveSecondaryWeapon()
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

    static getSelectedSecondaryWeaponAmmoIndex()
    {
        return JSON.parse(localStorage.selectedSecondaryWeaponAmmoIndex)
    }

    static removeSecondaryWeaponAmmoByIndex(index)
    {
        if (index != -1)
        {
            var ammunition = JSON.parse(localStorage.ammunition)
            ammunition.splice(index, 1)
            localStorage.ammunition = JSON.stringify(ammunition)
        }
    }

    static upgradeWeapon(index, statName)
    {
        var weapons = JSON.parse(localStorage.primaryWeapons)
        var weapon = weapons[index]
        var oldStats = weapon.stats[statName]
        weapon.stats[statName] = {value: oldStats.value + oldStats.incLevel, incCount: oldStats.incCount+1, incLevel: oldStats.incLevel, basePrice: oldStats.basePrice}
        localStorage.primaryWeapons = JSON.stringify(weapons)
    }

    static debitMoney(amount)
    {
        if (PlayerStats.getMoney() >= amount)
        {
            PlayerStats.removeMoney(amount)
            return true
        }

        return false
    }

    static buyShootDelayDecrease()
    {
        var price = PlayerStats.getCostsShootDelayDecrease()
        if (price != -1)
        {
            if (PlayerStats.debitMoney(price))
            {
                var currentDelySec = JSON.parse(localStorage.shootDelaySec)
                localStorage.shootDelaySec = JSON.stringify(currentDelySec - 0.5)
            }
        }
    }

    static buyRepairKit()
    {
        var price = HqStats.getCostsRepairKit()
        if (PlayerStats.debitMoney(price))
        {
            var repairKitCount = JSON.parse(localStorage.repairKitCount)
            localStorage.repairKitCount = JSON.stringify(repairKitCount + 1)
        }
    }

    static useRepairKit()
    {
        if (PlayerStats.Player.hitPoints < PlayerStats.getHitPoints())
        {
            var repairKitCount = JSON.parse(localStorage.repairKitCount)

            if (repairKitCount > 0)
            {
                localStorage.repairKitCount = JSON.stringify(repairKitCount - 1)
                PlayerStats.Player.hitPoints += 20
            }
        }
    }

    static getRepairKitCount()
    {
        return JSON.parse(localStorage.repairKitCount)
    }

    static getRoundDamage()
    {
        return 30
    }
}