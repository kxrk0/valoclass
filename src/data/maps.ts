import type { Map } from '@/types'

export const maps: Map[] = [
  {
    uuid: "d960549e-485c-e861-8d71-aa9d1aed12a2",
    displayName: "Bind",
    coordinates: "34.4°N 118.2°W",
    displayIcon: "/maps/bind/icon.png",
    listViewIcon: "/maps/bind/list.png",
    splash: "/maps/bind/splash.png",
    stylizedDevName: "Duality",
    premierBackgroundImage: "/maps/bind/premier.png",
    tacticalDescription: "Two sites. No middle. Gotta pick left or right. What's it going to be then? Both offer direct paths for attackers and a pair of one-way teleporters make it easier to flank.",
    callouts: [
      { regionName: "A Site", superRegionName: "A Site", location: { x: 150, y: 200 } },
      { regionName: "B Site", superRegionName: "B Site", location: { x: 400, y: 350 } },
      { regionName: "A Short", superRegionName: "A Site", location: { x: 180, y: 180 } },
      { regionName: "A Long", superRegionName: "A Site", location: { x: 120, y: 220 } },
      { regionName: "Hookah", superRegionName: "Mid", location: { x: 250, y: 280 } },
      { regionName: "Lamps", superRegionName: "B Site", location: { x: 380, y: 320 } },
      { regionName: "Elbow", superRegionName: "B Site", location: { x: 360, y: 300 } },
      { regionName: "Garden", superRegionName: "B Site", location: { x: 420, y: 380 } },
    ]
  },
  {
    uuid: "690b3ed2-4dff-945b-8223-6da834e30d24",
    displayName: "Breeze",
    coordinates: "26.2°N 127.9°E",
    displayIcon: "/maps/breeze/icon.png",
    listViewIcon: "/maps/breeze/list.png",
    splash: "/maps/breeze/splash.png",
    stylizedDevName: "Foxtrot",
    premierBackgroundImage: "/maps/breeze/premier.png",
    tacticalDescription: "Take in the sights of historic ruins or seaside caves on this tropical paradise. But don't let your guard down. You'll need to fight for your own slice of paradise.",
    callouts: [
      { regionName: "A Site", superRegionName: "A Site", location: { x: 180, y: 150 } },
      { regionName: "B Site", superRegionName: "B Site", location: { x: 450, y: 400 } },
      { regionName: "A Main", superRegionName: "A Site", location: { x: 160, y: 120 } },
      { regionName: "A Hall", superRegionName: "A Site", location: { x: 200, y: 130 } },
      { regionName: "Mid", superRegionName: "Mid", location: { x: 300, y: 250 } },
      { regionName: "Tubes", superRegionName: "Mid", location: { x: 280, y: 230 } },
      { regionName: "B Main", superRegionName: "B Site", location: { x: 470, y: 420 } },
      { regionName: "B Elbow", superRegionName: "B Site", location: { x: 430, y: 380 } },
    ]
  },
  {
    uuid: "7eaecc1b-4337-bbf6-6ab9-04b8f06b3319",
    displayName: "Fracture",
    coordinates: "35.1°N 87.8°W",
    displayIcon: "/maps/fracture/icon.png",
    listViewIcon: "/maps/fracture/list.png",
    splash: "/maps/fracture/splash.png",
    stylizedDevName: "Canyon",
    premierBackgroundImage: "/maps/fracture/premier.png",
    tacticalDescription: "A top secret research facility split apart by a failed radianite experiment. With defender options as divided as the map, the choice is yours: meet the attackers on their own turf or batten down the hatches to weather the assault.",
    callouts: [
      { regionName: "A Site", superRegionName: "A Site", location: { x: 200, y: 180 } },
      { regionName: "B Site", superRegionName: "B Site", location: { x: 400, y: 320 } },
      { regionName: "A Main", superRegionName: "A Site", location: { x: 180, y: 160 } },
      { regionName: "A Rope", superRegionName: "A Site", location: { x: 220, y: 200 } },
      { regionName: "A Drop", superRegionName: "A Site", location: { x: 240, y: 220 } },
      { regionName: "Dish", superRegionName: "Mid", location: { x: 300, y: 250 } },
      { regionName: "B Main", superRegionName: "B Site", location: { x: 420, y: 340 } },
      { regionName: "B Arcade", superRegionName: "B Site", location: { x: 380, y: 300 } },
    ]
  },
  {
    uuid: "2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba",
    displayName: "Ascent",
    coordinates: "45.26°N 12.33°E",
    displayIcon: "/maps/ascent/icon.png",
    listViewIcon: "/maps/ascent/list.png",
    splash: "/maps/ascent/splash.png",
    stylizedDevName: "Ascent",
    premierBackgroundImage: "/maps/ascent/premier.png",
    tacticalDescription: "An open playground for small wars of position and attrition divide two sites on Ascent. Each site can be fortified by irreversible bomb doors; once they're down, you'll have to destroy them or find another way.",
    callouts: [
      { regionName: "A Site", superRegionName: "A Site", location: { x: 170, y: 190 } },
      { regionName: "B Site", superRegionName: "B Site", location: { x: 430, y: 310 } },
      { regionName: "A Main", superRegionName: "A Site", location: { x: 150, y: 170 } },
      { regionName: "A Rafters", superRegionName: "A Site", location: { x: 190, y: 210 } },
      { regionName: "Mid", superRegionName: "Mid", location: { x: 300, y: 250 } },
      { regionName: "Catwalk", superRegionName: "Mid", location: { x: 320, y: 230 } },
      { regionName: "Market", superRegionName: "Mid", location: { x: 280, y: 270 } },
      { regionName: "B Main", superRegionName: "B Site", location: { x: 450, y: 330 } },
    ]
  },
  {
    uuid: "b529448b-4d60-346e-e89e-00a4c527a405",
    displayName: "Icebox",
    coordinates: "76.44°N 68.78°W",
    displayIcon: "/maps/icebox/icon.png",
    listViewIcon: "/maps/icebox/list.png",
    splash: "/maps/icebox/splash.png",
    stylizedDevName: "Port",
    premierBackgroundImage: "/maps/icebox/premier.png",
    tacticalDescription: "Your next battleground is a secret Kingdom excavation site overtaken by the arctic. The two plant sites here require some horizontal finesse. Take advantage of the ziplines and they'll never see you coming.",
    callouts: [
      { regionName: "A Site", superRegionName: "A Site", location: { x: 200, y: 150 } },
      { regionName: "B Site", superRegionName: "B Site", location: { x: 400, y: 350 } },
      { regionName: "A Belt", superRegionName: "A Site", location: { x: 180, y: 130 } },
      { regionName: "A Screens", superRegionName: "A Site", location: { x: 220, y: 170 } },
      { regionName: "Mid", superRegionName: "Mid", location: { x: 300, y: 250 } },
      { regionName: "Tube", superRegionName: "Mid", location: { x: 280, y: 230 } },
      { regionName: "B Green", superRegionName: "B Site", location: { x: 380, y: 330 } },
      { regionName: "B Yellow", superRegionName: "B Site", location: { x: 420, y: 370 } },
    ]
  },
  {
    uuid: "e2ad5c54-75fa-e56c-89eb-8b912921d032",
    displayName: "Pearl",
    coordinates: "38.73°N 9.14°W",
    displayIcon: "/maps/pearl/icon.png",
    listViewIcon: "/maps/pearl/list.png",
    splash: "/maps/pearl/splash.png",
    stylizedDevName: "Pitt",
    premierBackgroundImage: "/maps/pearl/premier.png",
    tacticalDescription: "Attackers push down into the defenders on this two-site map set in a vibrant, underwater city. Pearl's mid provides both an opportunity and a danger, as control of it is essential to success.",
    callouts: [
      { regionName: "A Site", superRegionName: "A Site", location: { x: 180, y: 170 } },
      { regionName: "B Site", superRegionName: "B Site", location: { x: 420, y: 330 } },
      { regionName: "A Main", superRegionName: "A Site", location: { x: 160, y: 150 } },
      { regionName: "A Art", superRegionName: "A Site", location: { x: 200, y: 190 } },
      { regionName: "Mid", superRegionName: "Mid", location: { x: 300, y: 250 } },
      { regionName: "Mid Shops", superRegionName: "Mid", location: { x: 280, y: 270 } },
      { regionName: "B Main", superRegionName: "B Site", location: { x: 440, y: 350 } },
      { regionName: "B Ramp", superRegionName: "B Site", location: { x: 400, y: 310 } },
    ]
  },
  {
    uuid: "92584fbe-486a-b1b2-9faa-39b0f486b498",
    displayName: "Lotus",
    coordinates: "11.57°N 92.61°E",
    displayIcon: "/maps/lotus/icon.png",
    listViewIcon: "/maps/lotus/list.png",
    splash: "/maps/lotus/splash.png",
    stylizedDevName: "Jam",
    premierBackgroundImage: "/maps/lotus/premier.png",
    tacticalDescription: "A mysterious structure housing an astral conduit radiates with ancient power. Great stone doors provide a variety of rotation options and unlock the paths to three sites, giving the attacking side the advantage of unpredictability.",
    callouts: [
      { regionName: "A Site", superRegionName: "A Site", location: { x: 150, y: 180 } },
      { regionName: "B Site", superRegionName: "B Site", location: { x: 300, y: 300 } },
      { regionName: "C Site", superRegionName: "C Site", location: { x: 450, y: 200 } },
      { regionName: "A Main", superRegionName: "A Site", location: { x: 130, y: 160 } },
      { regionName: "A Tree", superRegionName: "A Site", location: { x: 170, y: 200 } },
      { regionName: "B Main", superRegionName: "B Site", location: { x: 280, y: 320 } },
      { regionName: "B Upper", superRegionName: "B Site", location: { x: 320, y: 280 } },
      { regionName: "C Main", superRegionName: "C Site", location: { x: 470, y: 220 } },
    ]
  }
]

export const getMapByName = (name: string) => {
  return maps.find(map => map.displayName.toLowerCase() === name.toLowerCase())
}

export const getMapCallouts = (mapName: string) => {
  const map = getMapByName(mapName)
  return map ? map.callouts : []
}
