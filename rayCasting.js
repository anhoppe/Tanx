
class CastClassificationEnum
{
    static NotFound = 0
    static ClockwiseDirection = 1
    static CounterClockDirection = 2
}

class RayCasting
{
    constructor(ray, coneAngleRad, viewDistance, totalRayCount)
    {
        this.ray = ray
        this.coneAngleRad = coneAngleRad
        this.viewDistance = viewDistance
        this.totalRayCount = totalRayCount
    }

    // Casts a cone into viewAngleRad direction.
    // Returns the classfication, either 
    //  - NotFound if the searchedSprite is not found in the cone
    //  - Clockwise if the searchedSprite is in clockwise direction
    //  - CounterClockWise if the searchedSprite is in counter clock direction
    classifySearchedSpriteOnCone(viewAngleRad, searchedSprite)
    {
        const totalRayCount = 10
        var result = CastClassificationEnum.NotFound;

        for (var index = 0; index < totalRayCount; index++)
        {
            var angle = viewAngleRad - this.coneAngleRad / 2 +  this.coneAngleRad / totalRayCount * index
            
            this.ray.setAngle(angle)
            let intersection = this.ray.cast();

            if (intersection.object === searchedSprite)
            {
                var distVector = new Phaser.Math.Vector2(this.ray.origin.x - intersection.x, this.ray.origin.y - intersection.y)

                if (distVector.lengthSq() < this.viewDistance * this.viewDistance)
                {
                    result = CastClassificationEnum.CounterClockDirection
                    if (index > 5)
                    {
                        result = CastClassificationEnum.ClockwiseDirection
                    }    
                }
            }
        }

        return result
    }

    getConeColisionPoints(viewAngleRad)
    {
        const totalRayCount = 50
        var results = []

        for (var index = 0; index < totalRayCount; index++)
        {
            var angle = viewAngleRad - this.coneAngleRad / 2 +  this.coneAngleRad / totalRayCount * index

            var xTarget = Math.cos(angle) * this.viewDistance + this.ray.origin.x
            var yTarget = Math.sin(angle) * this.viewDistance + this.ray.origin.y
            var vectorWithoutCollision = new Phaser.Math.Vector2(xTarget - this.ray.origin.x, yTarget - this.ray.origin.y)
            
            this.ray.setAngle(angle)
            let intersection = this.ray.cast();

            if (intersection.object != null)
            {
                var vectorWithCollision = new Phaser.Math.Vector2(this.ray.origin.x - intersection.x, this.ray.origin.y - intersection.y)

                if (vectorWithCollision.lengthSq() < vectorWithoutCollision.lengthSq())
                {
                    xTarget = intersection.x
                    yTarget = intersection.y
                }
            }

            results.push({
                x: xTarget,
                y: yTarget
            })

        }

        return results
    }
}
