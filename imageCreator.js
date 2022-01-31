function createImage(parentNodeId, imageName, imageIndex)
{
    var image = createRayImage(imageName, imageIndex)

    var column = createColumnWithImage(image)

    document.getElementById(parentNodeId).appendChild(column)

    return image
}

function createImageWithActivatedState(parentNodeId, imageName, imageIndex, isActive)
{
    var image = createRayImage(imageName, imageIndex)

    var column = createColumnWithImage(image)

    if (isActive)
    {
        column.setAttribute("class", "activeColumn")
    }

    document.getElementById(parentNodeId).appendChild(column)

    return image
}

function createImageWithText(parentNodeId, imageName, imageIndex, imageText)
{
    var image = createRayImage(imageName, imageIndex)

    var column = createColumnWithImage(image)
    
    var textLabel = document.createElement("label")
    textLabel.innerHTML = imageText
    column.appendChild(textLabel)

    document.getElementById(parentNodeId).appendChild(column)

    return image
}

function createRayImage(imageName, imageIndex)
{
    var image = document.createElement("img");
    image.setAttribute("src", imageName)
    image.setAttribute("id", imageIndex)

    return image
}

function createColumnWithImage(image)
{
    var column = document.createElement("column")
    
    column.setAttribute("class", "column")
    column.appendChild(image)

    return column
}
