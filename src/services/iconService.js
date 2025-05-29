function normalizeApplianceIcon(id, icon) {
    return {
        id,
        name: icon.name,
        meal: 'appliance', // Special category for appliances
        cuisines: icon.tags || [], // Use tags as cuisines
        solid: icon.solid,
        outline: icon.outline
    }
}

function normalizeRecipeIcon(id, icon) {
    return {
        id,
        name: icon.name,
        meal: icon.meal,
        cuisines: icon.cuisines,
        solid: icon.solid,
        outline: icon.outline
    }
}

async function loadIconFile(path) {
    try {
        const response = await fetch(path)
        if (!response.ok) {
            throw new Error(`Failed to load icons from ${path}`)
        }
        return await response.json()
    } catch (error) {
        console.error(`Error loading icons from ${path}:`, error)
        return {}
    }
}

export async function loadAllIcons() {
    const [appliances, recipes] = await Promise.all([
        loadIconFile('/src/data/icons/appliances.json'),
        loadIconFile('/src/data/icons/recipes.json')
    ])

    const normalizedIcons = {}

    // Normalize appliance icons
    Object.entries(appliances).forEach(([id, icon]) => {
        normalizedIcons[id] = normalizeApplianceIcon(id, icon)
    })

    // Normalize recipe icons
    Object.entries(recipes).forEach(([id, icon]) => {
        normalizedIcons[id] = normalizeRecipeIcon(id, icon)
    })

    return normalizedIcons
} 