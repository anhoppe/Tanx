var hq_global_variable = 0

class Hq
{
    constructor(scene, hqObject, player)
    {
        this.hqMenu = scene.add.dom(hqObject.x, hqObject.y).createFromCache('hqWarMenu');

        this.hqMenu.setPerspective(800)
        this.hqMenu.visible = false

        this.updateContent(player)

        this.hqSpriteGroup = scene.physics.add.staticGroup()
        this.hqSprite = this.hqSpriteGroup.create(hqObject.x, hqObject.y, 'hq')

        this.playerStartPosition = new Phaser.Math.Vector2(hqObject.x, hqObject.y - hqObject.height)
        player.setPosition(this.playerStartPosition)

        hq_global_variable = this
    }

    setupCollision(physics, spriteGroup)
    {
        physics.add.collider(this.hqSpriteGroup, spriteGroup)
    }

    displayMenuOnCollision(physics, player, camera)
    {
        const width = 800
        const height = 600
        physics.add.overlap(player.baseSprite, this.hqSprite, (playerSprite, hqSprite) => {
            
            if (!this.isActive())
            {
                this.hqMenu.x = camera.midPoint.x - width / 2
                this.hqMenu.y = camera.midPoint.y - height / 2

                var style = this.hqMenu.node.style;
                style.width = width + 'px';
                style.height = height + 'px';
                this.hqMenu.updateSize();

                this.hqMenu.addListener('click');
                this.hqMenu.visible = true
                this.updateContent(player)
                player.deactivate()    
            }
        })
    }

    isActive()
    {
        return this.hqMenu.visible
    }

    updateContent(player)
    {
        this.hqMenu.getChildByProperty("id", "repairButton").innerHTML = "Repair Tank (" + PlayerStats.getRepairKitCount() + " units left)"

        var secondaryGunName = "None"

        if (player.secsecondaryGun != 0)
        {
            secondaryGunName = player.secondaryGun.type
            
            var ammoOwnedByPlayer = PlayerStats.getAllAmmoOwnedByPlayer()

           this.setAmmoSlotImage(ammoOwnedByPlayer);

            this.setAvailableAmmoImages(ammoOwnedByPlayer, player);
        }
        
        document.getElementById("activeSecondaryWeaponLabel").innerHTML = secondaryGunName

        this.hqMenu.on('click', function (event) {
    
            if (event.target.id === 'repairButton')
            {
                PlayerStats.useRepairKit()
                hq_global_variable.hqMenu.getChildByProperty("id", "repairButton").innerHTML = "Repair Tank (" + PlayerStats.getRepairKitCount() + " units left)"
            }
            else if (event.target.id === 'leaveButton')
            {
                //  Turn off the click events
                hq_global_variable.hqMenu.removeListener('click');
                hq_global_variable.hqMenu.visible = false

                player.activate(hq_global_variable.playerStartPosition)
            }
            else if (event.target.id === 'capitulateButton')
            {
                if (confirm("Do you really want to capitulate?") == true)
                {
                    location.href = "main.html"
                }
            }
        });
    }

    setAmmoSlotImage(ammoOwnedByPlayer) 
    {
        var slotColumn = document.getElementById("slotColumn")
        var slotImage = document.getElementById("secondayWeaponSlotImage")
        if (slotImage != null) {
            slotColumn.removeChild(slotImage);
        }
    
        var loadedAmmoIndex = PlayerStats.getSelectedSecondaryWeaponAmmoIndex()

        if (loadedAmmoIndex != -1) {
            var ammo = ammoOwnedByPlayer[loadedAmmoIndex];

            var slotImage = document.createElement("img");
            slotImage.setAttribute("src", ammo.shopImage);
            slotImage.setAttribute("id", "secondayWeaponSlotImage");
            slotColumn.appendChild(slotImage);
        }
    }
    
    setAvailableAmmoImages(ammoOwnedByPlayer, player) 
    {
        
        document.getElementById("availableAmmo").innerHTML = '';

        for (var index = 0; index < ammoOwnedByPlayer.length; index++) {
            if (ammoOwnedByPlayer[index].weaponType == player.secondaryGun.type) {
                var image = document.createElement("img");
                image.setAttribute("src", ammoOwnedByPlayer[index].shopImage);
                image.setAttribute("id", ammoOwnedByPlayer[index].index);

                image.onclick = (event) => {
                    var id = parseInt(event.srcElement.id);

                    var image = document.createElement("img");
                    image.setAttribute("src", ammoOwnedByPlayer[id].shopImage);
                    image.setAttribute("id", "secondayWeaponSlotImage");

                    var oldImage = document.getElementById("secondayWeaponSlotImage");
                    if (oldImage != null) {
                        document.getElementById("slotColumn").replaceChild(image, oldImage);
                    }

                    else {
                        document.getElementById("slotColumn").appendChild(image);
                    }
                    PlayerStats.setSelectedSecondaryWeaponAmmoIndex(id);
                };

                var column = document.createElement("column");
                column.setAttribute("class", "column");
                column.appendChild(image);

                document.getElementById("availableAmmo").appendChild(column);
            }
        }
    }
}

function onTabClick(evt, tabName) 
{
    // Select main tab
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent")
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none"
    }
    tablinks = document.getElementsByClassName("tablinks")
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "")
    }
    document.getElementById(tabName).style.display = "block"
    evt.currentTarget.className += " active"
}