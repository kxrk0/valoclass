import type { Agent } from '@/types'

export const agents: Agent[] = [
  {
    uuid: "dade69b4-4f5a-8528-247b-219e5a1facd6",
    displayName: "Fade",
    description: "Turkish bounty hunter Fade unleashes the power of raw nightmare to seize enemy secrets. Attuned with terror itself, she hunts down targets and reveals their deepest fears—before crushing them in the dark.",
    developerName: "BountyHunter",
    characterTags: ["Initiator"],
    displayIcon: "/agents/fade/icon.png",
    displayIconSmall: "/agents/fade/icon-small.png",
    bustPortrait: "/agents/fade/bust.png",
    fullPortrait: "/agents/fade/full.png",
    killfeedPortrait: "/agents/fade/killfeed.png",
    background: "/agents/fade/background.png",
    role: {
      uuid: "1b47567f-8f7b-444b-aae3-b0c634622d10",
      displayName: "Initiator",
      description: "Initiators challenge angles by setting up their team to enter contested ground and push defenders away.",
      displayIcon: "/roles/initiator.png"
    },
    abilities: [
      {
        slot: "C",
        displayName: "Prowler",
        description: "EQUIP a prowler. FIRE to send the prowler out. HOLD FIRE to steer the prowler towards your crosshair. The prowler will chase down the first enemy or terror trail it sees and nearsight the enemy on impact.",
        displayIcon: "/agents/fade/abilities/prowler.png"
      },
      {
        slot: "Q",
        displayName: "Seize",
        description: "EQUIP an orb of nightmare ink. FIRE to throw the orb which will plummet to the ground after a set amount of time. Upon hitting the ground, the ink will explode and create a zone in which enemies who are caught in it cannot escape the zone by normal means.",
        displayIcon: "/agents/fade/abilities/seize.png"
      },
      {
        slot: "E",
        displayName: "Haunt",
        description: "EQUIP a nightmarish entity. FIRE to throw the orb which will plummet to the ground after a set amount of time. Upon hitting the ground, the orb will turn into a nightmarish entity that will reveal the location of enemies caught in its sight.",
        displayIcon: "/agents/fade/abilities/haunt.png"
      },
      {
        slot: "X",
        displayName: "Nightfall",
        description: "EQUIP the power of Fear. FIRE to send out a wave of nightmare energy that can traverse through walls. The energy creates a trail to the opponent as well as deafens and decays them.",
        displayIcon: "/agents/fade/abilities/nightfall.png"
      }
    ]
  },
  {
    uuid: "5f8d3a7f-467b-97f3-062c-13acf203c006",
    displayName: "Breach",
    description: "Breach, the bionic Swede, fires powerful, targeted kinetic blasts to aggressively clear a path through enemy ground. The damage and disruption he inflicts ensures no fight is ever fair.",
    developerName: "Breach",
    characterTags: ["Initiator"],
    displayIcon: "/agents/breach/icon.png",
    displayIconSmall: "/agents/breach/icon-small.png",
    bustPortrait: "/agents/breach/bust.png",
    fullPortrait: "/agents/breach/full.png",
    killfeedPortrait: "/agents/breach/killfeed.png",
    background: "/agents/breach/background.png",
    role: {
      uuid: "1b47567f-8f7b-444b-aae3-b0c634622d10",
      displayName: "Initiator",
      description: "Initiators challenge angles by setting up their team to enter contested ground and push defenders away.",
      displayIcon: "/roles/initiator.png"
    },
    abilities: [
      {
        slot: "C",
        displayName: "Aftershock",
        description: "EQUIP a fusion charge. FIRE the charge to set a slow-acting burst through the wall. The burst does heavy damage to anyone caught in its area.",
        displayIcon: "/agents/breach/abilities/aftershock.png"
      },
      {
        slot: "Q",
        displayName: "Flashpoint",
        description: "EQUIP a blinding charge. FIRE the charge to set a fast-acting burst through the wall. The charge detonates to blind all players looking at it.",
        displayIcon: "/agents/breach/abilities/flashpoint.png"
      },
      {
        slot: "E",
        displayName: "Fault Line",
        description: "EQUIP a seismic blast. HOLD FIRE to increase the range. RELEASE to set off the quake, dazing all players in its zone and in a line up to the zone.",
        displayIcon: "/agents/breach/abilities/faultline.png"
      },
      {
        slot: "X",
        displayName: "Rolling Thunder",
        description: "EQUIP a seismic charge. FIRE to send a cascading quake through all terrain in a large cone. The quake dazes and knocks up anyone caught in it.",
        displayIcon: "/agents/breach/abilities/rollingthunder.png"
      }
    ]
  },
  {
    uuid: "1e58de9c-4950-5125-93e9-a0aee9f98746",
    displayName: "Killjoy",
    description: "The genius of Germany, Killjoy secures the battlefield with ease using her arsenal of inventions. If the damage from her gear doesn't stop her enemies, her robots' debuff will help make short work of them.",
    developerName: "Killjoy",
    characterTags: ["Sentinel"],
    displayIcon: "/agents/killjoy/icon.png",
    displayIconSmall: "/agents/killjoy/icon-small.png",
    bustPortrait: "/agents/killjoy/bust.png",
    fullPortrait: "/agents/killjoy/full.png",
    killfeedPortrait: "/agents/killjoy/killfeed.png",
    background: "/agents/killjoy/background.png",
    role: {
      uuid: "5fc02f99-4091-4486-a531-98459a3e95e9",
      displayName: "Sentinel",
      description: "Sentinels are defensive experts who can lock down areas and watch flanks, both on attacker and defender rounds.",
      displayIcon: "/roles/sentinel.png"
    },
    abilities: [
      {
        slot: "C",
        displayName: "Nanoswarm",
        description: "EQUIP a Nanoswarm grenade. FIRE to throw the grenade. Upon landing, the Nanoswarm goes covert. ACTIVATE the Nanoswarm to deploy a damaging swarm of nanobots.",
        displayIcon: "/agents/killjoy/abilities/nanoswarm.png"
      },
      {
        slot: "Q",
        displayName: "Alarmbot",
        description: "EQUIP an Alarmbot. FIRE to deploy a bot that hunts down enemies that get in range. After reaching its target, the bot explodes, applying Vulnerable. HOLD EQUIP to recall a deployed bot.",
        displayIcon: "/agents/killjoy/abilities/alarmbot.png"
      },
      {
        slot: "E",
        displayName: "Turret",
        description: "EQUIP a Turret. FIRE to deploy a turret that fires at enemies in a 180 degree cone. HOLD EQUIP to recall the deployed turret.",
        displayIcon: "/agents/killjoy/abilities/turret.png"
      },
      {
        slot: "X",
        displayName: "Lockdown",
        description: "EQUIP the Lockdown device. FIRE to deploy the device. After a long windup, the device Detains all enemies caught in the radius. The device can be destroyed by enemies.",
        displayIcon: "/agents/killjoy/abilities/lockdown.png"
      }
    ]
  },
  {
    uuid: "707eab51-4836-f488-046a-cda6bf494859",
    displayName: "Viper",
    description: "The American chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and cripple the enemy's vision. If the toxins don't kill her prey, her mind games surely will.",
    developerName: "Pandemic",
    characterTags: ["Controller"],
    displayIcon: "/agents/viper/icon.png",
    displayIconSmall: "/agents/viper/icon-small.png",
    bustPortrait: "/agents/viper/bust.png",
    fullPortrait: "/agents/viper/full.png",
    killfeedPortrait: "/agents/viper/killfeed.png",
    background: "/agents/viper/background.png",
    role: {
      uuid: "4ee40330-ecdd-4f2f-98a8-eb1243428373",
      displayName: "Controller",
      description: "Controllers are experts in slicing up dangerous territory to set their team up for success.",
      displayIcon: "/roles/controller.png"
    },
    abilities: [
      {
        slot: "C",
        displayName: "Snake Bite",
        description: "EQUIP a chemical launcher. FIRE to launch a canister that shatters upon hitting the floor, creating a lingering chemical zone that damages and applies Vulnerable.",
        displayIcon: "/agents/viper/abilities/snakebite.png"
      },
      {
        slot: "Q",
        displayName: "Poison Cloud",
        description: "EQUIP a gas emitter. FIRE to throw the emitter that perpetually remains throughout the round. RE-USE the ability to create a toxic gas cloud at the cost of fuel. This ability can be RE-USED more than once and can be picked up to be REDEPLOYED.",
        displayIcon: "/agents/viper/abilities/poisoncloud.png"
      },
      {
        slot: "E",
        displayName: "Toxic Screen",
        description: "EQUIP a gas emitter launcher. FIRE to deploy a long line of gas emitters. RE-USE the ability to create a tall wall of toxic gas at the cost of fuel. This ability can be RE-USED more than once.",
        displayIcon: "/agents/viper/abilities/toxicscreen.png"
      },
      {
        slot: "X",
        displayName: "Viper's Pit",
        description: "EQUIP a chemical sprayer. FIRE to spray a chemical cloud in all directions around Viper, creating a large cloud that reduces the vision range and maximum health of players inside of it.",
        displayIcon: "/agents/viper/abilities/viperspit.png"
      }
    ]
  },
  {
    uuid: "320b2a48-4d9b-a075-30f1-1f93a9b638fa",
    displayName: "Sova",
    description: "Born from the eternal winter of Russia's tundra, Sova tracks, finds, and eliminates enemies with ruthless efficiency and precision. His custom bow and incredible scouting abilities ensure that even if you run, you cannot hide.",
    developerName: "Sova",
    characterTags: ["Initiator"],
    displayIcon: "/agents/sova/icon.png",
    displayIconSmall: "/agents/sova/icon-small.png",
    bustPortrait: "/agents/sova/bust.png",
    fullPortrait: "/agents/sova/full.png",
    killfeedPortrait: "/agents/sova/killfeed.png",
    background: "/agents/sova/background.png",
    role: {
      uuid: "1b47567f-8f7b-444b-aae3-b0c634622d10",
      displayName: "Initiator",
      description: "Initiators challenge angles by setting up their team to enter contested ground and push defenders away.",
      displayIcon: "/roles/initiator.png"
    },
    abilities: [
      {
        slot: "C",
        displayName: "Owl Drone",
        description: "EQUIP an owl drone. FIRE to deploy and take control of movement of the drone. While in control of the drone, FIRE to shoot a marking dart. This dart will reveal the location of any player struck by the dart.",
        displayIcon: "/agents/sova/abilities/owldrone.png"
      },
      {
        slot: "Q",
        displayName: "Shock Bolt",
        description: "EQUIP a bow with a shock bolt. FIRE to send the explosive bolt forward, detonating upon collision and damaging players nearby. HOLD FIRE to extend the range of the projectile. ALTERNATE FIRE to add up to two bounces to this arrow.",
        displayIcon: "/agents/sova/abilities/shockbolt.png"
      },
      {
        slot: "E",
        displayName: "Recon Bolt",
        description: "EQUIP a bow with a recon bolt. FIRE to send the recon bolt forward, activating upon collision and revealing the location of nearby enemies caught in the line of sight of the bolt. HOLD FIRE to extend the range of the projectile. ALTERNATE FIRE to add up to two bounces to this arrow.",
        displayIcon: "/agents/sova/abilities/reconbolt.png"
      },
      {
        slot: "X",
        displayName: "Hunter's Fury",
        description: "EQUIP a bow with three long-range wall-piercing energy blasts. FIRE to release an energy blast in a line in front of Sova, dealing damage and revealing the location of enemies caught in the line. This ability can be RE-USED up to two more times while the ability timer is active.",
        displayIcon: "/agents/sova/abilities/huntersfury.png"
      }
    ]
  }
]

export const agentsByRole = {
  duelist: agents.filter(agent => agent.role.displayName === 'Duelist'),
  initiator: agents.filter(agent => agent.role.displayName === 'Initiator'),
  controller: agents.filter(agent => agent.role.displayName === 'Controller'),
  sentinel: agents.filter(agent => agent.role.displayName === 'Sentinel'),
}

export const getAgentByName = (name: string) => {
  return agents.find(agent => agent.displayName.toLowerCase() === name.toLowerCase())
}

export const getAgentsByRole = (role: string) => {
  return agents.filter(agent => agent.role.displayName.toLowerCase() === role.toLowerCase())
}
