class PlayerStats
{
    // Reference to the player instance in TanxScene is used to track the current hit points
    static Player = 0

    // Absolute number of levels that are available
    static TotalLevelCount = 2

    static reset()
    {
        localStorage.maxLevelReached = JSON.stringify(1)
        localStorage.currentLevel = JSON.stringify(1)
        localStorage.money = JSON.stringify(0)
        localStorage.shootDelaySec = JSON.stringify(3)
        localStorage.hitPoints = JSON.stringify(50)
        localStorage.rotationSpeedRad = JSON.stringify(0.02)
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

    static getShootDelaySec()
    {
        return JSON.parse(localStorage.shootDelaySec)
    }

    static getCostsShootDelayDecrease()
    {
        var currentDelySec = JSON.parse(localStorage.shootDelaySec)

        if (currentDelySec > 0.5)
        {
            return Math.pow(10 * (4 - currentDelySec), 2)
        }

        return -1
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