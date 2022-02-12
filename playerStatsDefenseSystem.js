class PlayerStatsDefenseSystem
{
    reset()
    {
        var defenseSystems = []
        localStorage.defenseSystems = JSON.stringify(defenseSystems)

        this.setSelectedIndex(-1)
    }
    
    getBuyable()
    {
        return [
            {
                index: 0,
                name: 'groundCannon',
                shopImage: 'assets/shop_ground_cannon.png',
                price: 500,
                hitPoints: 500,
            }
        ]
    }

    getOwnedByPlayer()
    {
        return JSON.parse(localStorage.defenseSystems)
    }

    getSelectedIndex()
    {
        return JSON.parse(localStorage.selectedDefenseSystemIndex)
    }

    setSelectedIndex(index)
    {
        localStorage.selectedDefenseSystemIndex = JSON.stringify(index)
    }

    add(defenseSystem)
    {
        var defenseSystems = JSON.parse(localStorage.defenseSystems)

        defenseSystems.push(defenseSystem)

        localStorage.defenseSystems = JSON.stringify(defenseSystems)
    }
}
