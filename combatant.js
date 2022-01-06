class Combatant
{
    constructor(maxHitPoints)
    {
        this.hitPoints = maxHitPoints
    }

    takeDamage(damage)
    {
        this.hitPoints -= damage
    }
}