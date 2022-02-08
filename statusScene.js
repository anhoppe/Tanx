class StatusScene extends Phaser.Scene
{
    constructor(config)
    {
        super(config)
        Phaser.Scene.call(this, {key:'status', active: true})

    }

    create()
    {
        this.healthBar = this.makeBar(140, 100, 0xcc306c);
        this.setValue(this.healthBar, 100);
        
        var fontStyle = new Phaser.GameObjects.TextStyle()
        fontStyle.fontFamily = 'Verdana'
        fontStyle.fontSize = '20px'
        fontStyle.color = '#00ffff'
        this.secondaryWeaponInfoLabel = this.add.text(140, 220, '', fontStyle);
    }

    update() 
    {
        this.setValue(this.healthBar, PlayerStats.getHitPointsInPerCent())

        var secondaryWeapon = PlayerStats.Secondary.getActive()
        if (secondaryWeapon != 0)
        {

            var text = secondaryWeapon.type

            var ammo = PlayerStats.Ammo.getSelected()

            if (ammo != 0)
            {
                if ("units" in ammo)
                {
                    text += " Units: " + ammo.units
                }
            }
            else
            {
                text += " (not loaded)"
            }

            this.secondaryWeaponInfoLabel.text = text
        }
    }

    makeBar(x, y, color) 
    {
        //draw the bar
        let bar = this.add.graphics();

        //color the bar
        bar.fillStyle(color, 1);

        //fill the bar with a rectangle
        bar.fillRect(0, 0, 200, 50);
        
        //position the bar
        bar.x = x;
        bar.y = y;

        //return the bar
        return bar;
    }

    setValue(bar, percentage) 
    {
        bar.scaleX = percentage / 100;
    }
}