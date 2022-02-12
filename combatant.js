class Combatant
{
    constructor(maxHitPoints)
    {
        this.hitPoints = maxHitPoints        
    }

    takeDamage(damage)
    {
        this.hitPoints -= damage

        if (this.hitPoints <= 0)
        {
            this.baseSprite.disableBody(true, true)
        }
    }
}
