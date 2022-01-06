class PlayerStats
{
    // Reference to the player instance in TanxScene is used to track the current hit points
    static Player = 0

    static reset()
    {
        localStorage.level = JSON.stringify(1)
        localStorage.money = JSON.stringify(0)
        localStorage.shootDelaySec = JSON.stringify(3)
        localStorage.hitPoints = JSON.stringify(50)
        localStorage.rotationSpeedRad = JSON.stringify(0.02)
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
    
    static getLevel()
    {
        return localStorage.level
    }
    
    static incLevel()
    {
        return localStorage.level = JSON.stringify(JSON.parse(localStorage.level) + 1)
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

    static buyShootDelayDecrease()
    {
        var price = this.getCostsShootDelayDecrease()
        if (price != -1)
        {
            if (this.getMoney() >= this.getCostsShootDelayDecrease())
            {
                 this.removeMoney(price)
                 
                 var currentDelySec = JSON.parse(localStorage.shootDelaySec)
                 localStorage.shootDelaySec = JSON.stringify(currentDelySec - 0.5)
            }
        }
    }

    static getRoundDamage()
    {
        return 30
    }
}