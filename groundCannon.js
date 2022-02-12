class GroundCannon extends Combatant
{
    constructor(dataTemplate, defenseSystemGroup, x, y, scene, obstacles)
    {
        super(dataTemplate['hitPoints'])

        this.scene = scene
        this.baseSprite = defenseSystemGroup.create(x, y, 'groundCannon')

        this.weapon = Weapon.FactoryFromName("gun")
        this.weapon.scene = scene
        this.weapon.obstacles = obstacles
        this.weapon.stats["reloadDurationSec"].value = 1.5

        this.angle = 0

        this.rotationSpeed = 0.02
    }

    move(enemyGroup, onRoundHitCallback)
    {
        if (this.baseSprite.active)
        {
            this.angle += this.rotationSpeed

            this.baseSprite.setRotation(this.angle)
    
            const dx = Math.cos(this.angle)
            const dy = Math.sin(this.angle)
    
            this.weapon.update(enemyGroup, onRoundHitCallback)
            this.weapon.fire(this.baseSprite.x, this.baseSprite.y, this.baseSprite.x + dx, this.baseSprite.y + dy)
        }
    }
}
