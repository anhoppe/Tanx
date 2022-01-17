class Weapon
{
    constructor(weaponTypeId, template)
    {
        this.type = weaponTypeId
        this.gameImage = template.gameImage
        this.shopImage = template.shopImage
        
        this.obstacles = 0
        this.scene = 0

        this.stats = template.stats

        this.lastFireTimeSec = 0

        this.activeRounds = []
    }

    static FactoryFromName(weaponName)
    {
        var weapon = 0

        if (weaponName == "gun")
        {
            var template = {
                stats: {
                    "damage": {value: 30, incCount: 0, incLevel: 5, basePrice: 30},
                    "range": {value: 500, incCount: 0, incLevel: 20, basePrice: 15},
                    "reloadDurationSec": {value: 3, incCount: 0, incLevel: -0.4, basePrice: 25},
                    "roundSpeed": {value: 400, incCount: 0, incLevel: 20, basePrice: 20},
                },
                gameImage: "player_turret",
                shopImage: "assets/shop_gun.png"
            }
            weapon = new Gun(template)
        }
        else if (weaponName == "rearGun")
        {
            var template = {
                stats: {
                    "damage": {value: 30, incCount: 0, incLevel: 5, basePrice: 30},
                    "range": {value: 500, incCount: 0, incLevel: 20, basePrice: 15},
                    "reloadDurationSec": {value: 3, incCount: 0, incLevel: -0.4, basePrice: 25},
                    "roundSpeed": {value: 400, incCount: 0, incLevel: 20, basePrice: 20},
                },
                gameImage: "player_rearGun",
                shopImage: "assets/shop_rearGun.png"
            }
            weapon = new RearGun(template)
        }
        else if (weaponName == "spreadGun")
        {
            var template = {
                stats: {
                    "damage": {value: 30, incCount: 0, incLevel: 5, basePrice: 30},
                    "range": {value: 500, incCount: 0, incLevel: 20, basePrice: 15},
                    "reloadDurationSec": {value: 3, incCount: 0, incLevel: -0.4, basePrice: 25},
                    "roundSpeed": {value: 400, incCount: 0, incLevel: 20, basePrice: 20},
                },
                gameImage: "player_spreadGun",
                shopImage: "assets/shop_spread_gun.png"
            }
            weapon = new SpreadGun(template)
        }
        else
        {

        }

        return weapon
    }

    static FactoryFromTemplate(template)
    {
        var weapon = 0

        if (template.type == "gun")
        {
            weapon = new Gun(template)
        }
        else if (template.type == "rearGun")
        {
            weapon = new RearGun(template)
        }
        else if (template.type == "spreadGun")
        {
            weapon = new SpreadGun(template)
        }

        return weapon
    }

    fire(xFrom, yFrom, xTo, yTo)
    {
        if (this.isMinTimeElapsed())
        {
            this.lastFireTimeSec = Date.now() / 1000

            var shots = this.emitShot(this.scene.physics, xFrom, yFrom, xTo, yTo)

            for (var shot of shots)
            {
                this.activeRounds.push(shot)

                this.scene.physics.add.collider(shot[1], this.obstacles, (round, obstacle) => 
                {
                    round.destroy()
                    this.roundFiring = false
    
                    this.setExplosion(round)
                }, null, this.scene)
            }
        }
    }

    update(combatantGroup, onRoundHitCallback)
    {
        var roundForDeletion = []

        for (var round of this.activeRounds)
        {
            var startPos = round[0]
            var sprite = round[1]

            if (!sprite.active)
            {
                roundForDeletion.push(round)
                continue
            }

            var vec = new Phaser.Math.Vector2(sprite.x, sprite.y)
            var range = this.stats["range"].value
            if (vec.distanceSq(startPos) > range * range)
            {
                sprite.destroy()
            }

            var worldBounds = this.scene.physics.world.bounds
            if(sprite.x > worldBounds.width || sprite.y > worldBounds.height || sprite.x < 0 || sprite.y < 0)
            {
                this.roundFiring = false
                sprite.destroy()
            }

            this.scene.physics.add.overlap(sprite, combatantGroup, (round, combatantSprite) => 
            { 
                round.destroy()
                this.roundFiring = false

                this.setExplosion(round)

                onRoundHitCallback(combatantSprite, this.stats["damage"].value)
            }, null, this.scene)
        }

        this.activeRounds = this.activeRounds.filter(item => !roundForDeletion.includes(item))
    }

    isMinTimeElapsed()
    {
        var currentTimeSec = Date.now() / 1000
        return (currentTimeSec - this.lastFireTimeSec) > this.stats["reloadDurationSec"].value ? true : false
    }

    setExplosion(round)
    {
        var explosion = this.scene.physics.add.sprite(round.x, round.y, 'explosion');
        explosion.anims.play('explosion', true)
        explosion.on('animationcomplete', () => explosion.destroy())
    }
}
