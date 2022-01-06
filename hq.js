var hq_global_variable = 0

class Hq
{
    constructor(scene, map, player)
    {
        const hqLayer = map.getObjectLayer('Hq')
        const hqObject = hqLayer.objects[0]
        
        this.hqMenu = scene.add.dom(hqObject.x, hqObject.y).createFromCache('hqMenu');
        this.hqMenu.setPerspective(800)
        this.hqMenu.visible = false

        this.hqMenu.on('click', function (event) {
    
            if (event.target.id === 'leaveButton')
            {
                //  Turn off the click events
                hq_global_variable.hqMenu.removeListener('click');
                hq_global_variable.hqMenu.visible = false

                player.setPosition(hq_global_variable.playerStartPosition)
            }
        });

        this.hqSprite = scene.physics.add.sprite(hqObject.x, hqObject.y, 'hq')

        this.playerStartPosition = new Phaser.Math.Vector2(hqObject.x, hqObject.y - hqObject.height)
        player.setPosition(this.playerStartPosition)

        hq_global_variable = this
    }

    displayMenuOnCollision(physics, playerSprite)
    {
        physics.add.overlap(playerSprite, this.hqSprite, (playerSprite, hqSprite) => {
            this.hqMenu.addListener('click');
            this.hqMenu.visible = true
        })
    }
}
