const gameConfig = {}

gameConfig.maxScreenWidth = 1920
gameConfig.maxScreenHeight = 1080

// SERVER:
gameConfig.serverUpdateRate = 9
gameConfig.maxPlayers = 40
gameConfig.maxPlayersHard = gameConfig.maxPlayers + 10
gameConfig.collisionDepth = 6
gameConfig.minimapRate = 3000

// COLLISIONS:
gameConfig.colGrid = 10

// CLIENT:
gameConfig.clientSendRate = 5

// UI:
gameConfig.healthBarWidth = 50
gameConfig.healthBarPad = 4.5
gameConfig.iconPadding = 15
gameConfig.iconPad = 0.9
gameConfig.deathFadeout = 3000
gameConfig.crownIconScale = 60
gameConfig.crownPad = 35

// CHAT:
gameConfig.chatCountdown = 3000
gameConfig.chatCooldown = 500

// SANDBOX:
gameConfig.inSandbox = /sandbox/.test(window?.location?.href || location?.href)

// PLAYER:
gameConfig.maxAge = 100
gameConfig.gatherAngle = Math.PI / 2.6
gameConfig.gatherWiggle = 10
gameConfig.hitReturnRatio = 0.25
gameConfig.hitAngle = Math.PI / 2
gameConfig.playerScale = 35
gameConfig.playerSpeed = 0.0016
gameConfig.playerDecel = 0.993
gameConfig.nameY = 34

// CUSTOMIZATION:
gameConfig.skinColors = [
    "#bf8f54", "#cbb091", "#896c4b",
    "#fadadc", "#ececec", "#c37373", 
    "#4c4c4c", "#ecaff7", "#738cc3",
    "#8bc373"
]

// ANIMALS:
gameConfig.animalCount = 7
gameConfig.aiTurnRandom = 0.06
gameConfig.cowNames = [
    "Sid", "Steph", "Bmoe", "Romn", "Jononthecool", 
    "Fiona", "Vince", "Nathan", "Nick", "Flappy", 
    "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", 
    "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", 
    "Reaper", "Ben", "Alan", "Naomi", "XYZ", 
    "Clever", "Jeremy", "Mike", "Destined", "Stallion", 
    "Allison", "Meaty", "Sophia", "Vaja", "Joey", 
    "Pendy", "Murdoch", "Theo", "Jared", "July", 
    "Sonia", "Mel", "Dexter", "Quinn", "Milky"
]

// WEAPONS:
gameConfig.shieldAngle = Math.PI / 3
gameConfig.weaponVariants = [{
    id: 0,
    src: "",
    xp: 0,
    val: 1
}, {
    id: 1,
    src: "_g",
    xp: 3000,
    val: 1.1
}, {
    id: 2,
    src: "_d",
    xp: 7000,
    val: 1.18
}, {
    id: 3,
    src: "_r",
    poison: true,
    xp: 12000,
    val: 1.18
}]
gameConfig.fetchVariant = function(player) {
    const tmpXP = player.weaponXP[player.weaponIndex] || 0

    for (let i = gameConfig.weaponVariants.length - 1; i >= 0; --i) {
        if (tmpXP >= gameConfig.weaponVariants[i].xp) {
            return gameConfig.weaponVariants[i]
        }
    }
}

// NATURE:
gameConfig.resourceTypes = [ "wood", "food", "stone", "points" ]
gameConfig.areaCount = 7
gameConfig.treesPerArea = 9
gameConfig.bushesPerArea = 3
gameConfig.totalRocks = 32
gameConfig.goldOres = 7
gameConfig.riverWidth = 724
gameConfig.riverPadding = 114
gameConfig.waterCurrent = 0.0011
gameConfig.waveSpeed = 0.0001
gameConfig.waveMax = 1.3
gameConfig.treeScales = [ 150, 160, 165, 175 ]
gameConfig.bushScales = [ 80, 85, 95 ]
gameConfig.rockScales = [ 80, 85, 90 ]

// BIOME DATA:
gameConfig.snowBiomeTop = 2400
gameConfig.snowSpeed = 0.75

// DATA:
gameConfig.maxNameLength = 15

// MAP:
gameConfig.mapScale = 14400
gameConfig.mapPingScale = 40
gameConfig.mapPingTime = 2200

export default gameConfig