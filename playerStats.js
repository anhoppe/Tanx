class PlayerStats
{
    // Reference to the player instance in TanxScene is used to track the current hit points
    static Player = 0

    // Absolute number of levels that are available
    static TotalLevelCount = 4

    static Weapons = new PlayerStatsWeapons()

    static Secondary = new PlayerStatsSecondaryWeapon()

    static Ammo = new PlayerStatsAmmo()

    static Defense = new PlayerStatsDefenseSystem()

    static reset()
    {
        PlayerStats.Weapons.reset()
        PlayerStats.Secondary.reset()
        PlayerStats.Ammo.reset()
        PlayerStats.Defense.reset()
        
        localStorage.maxLevelReached = JSON.stringify(1)
        localStorage.currentLevel = JSON.stringify(1)
        localStorage.money = JSON.stringify(10000)
        localStorage.hitPoints = JSON.stringify(50)
        localStorage.rotationSpeedRad = JSON.stringify(0.03)
        localStorage.repairKitCount = JSON.stringify(0)
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

    static debitMoney(amount)
    {
        if (PlayerStats.getMoney() >= amount)
        {
            PlayerStats.removeMoney(amount)
            return true
        }

        return false
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