import { Happener } from "./Happener";
import promptSync from 'prompt-sync';//const prompt = require('prompt-sync')({ sigint: true });
const prompt = promptSync();
import { ReadOnlyJsonMultipleCombined } from "./ReadOnlyJsonMultipleCombined";
import { PlayPlayable } from "./PlayPlayable";
import { Playable } from "./Playable";
import { PlayerAI } from "./PlayerAI";
import { definitions } from './20210415JsonPrivate/Gate/GateCampaignFramework.json';
import { SolutionNodeMap } from "./SolutionNodeMap";
import LostBoys from './20210415JsonPrivate/LostBoys/LostBoysCampaign.json'

/*
* This class isn't used anywhere else
*/
export class GoalSession {

  constructor(happener: Happener, startingThings: Map<string, Set<string>>, solutionNodeMap: SolutionNodeMap) {
    const numberOfAutopilotTurns = 0;
    const player = new PlayerAI(happener, numberOfAutopilotTurns);
    this.playable = new Playable(player, happener, solutionNodeMap);
    this.prerequisiteGoals = [];
    this.prerequisiteType = "";
    this.sunsetGoals = [];
    this.sunsetType = "";
    this.goalEnum = "";
    this.goalName = "";
    this.startingThings = startingThings;
  }

  GetTitle(): string {
    return this.goalName;
  }

  prerequisiteGoals: string[];
  prerequisiteType: string;
  sunsetGoals: string[];
  sunsetType: string;
  goalEnum: string;
  goalName: string;
  startingThings: Map<string, Set<string>>;
  playable: Playable;
}

export class GoalSessionCollection {

  constructor() {
    this.goals = new Array<GoalSession>();
  }

  IsActive(index: number): boolean {
    const gflags = new Set<string>();
    if (index < 0 || index >= this.goals.length)
      return false;
    for (let section of this.goals) {
      if (section.playable.IsCompleted())
        gflags.add(section.goalEnum);
    }
    let prerequisitesCompleted = 0;
    for (let prerequisite of this.goals[index].prerequisiteGoals) {
      if (gflags.has(prerequisite))
        prerequisitesCompleted++;
    }

    let sunsetsCompleted = 0;
    for (let sunset of this.goals[index].sunsetGoals) {
      if (gflags.has(sunset))
        sunsetsCompleted++;
    }

    let isPrerequisiteSatisfied = false;
    switch (this.goals[index].prerequisiteType) {
      case definitions.condition_enum_entity.oneOrMore:
        isPrerequisiteSatisfied = prerequisitesCompleted >= 1;
        break;
      case definitions.condition_enum_entity.twoOrMore:
        isPrerequisiteSatisfied = prerequisitesCompleted >= 2;
        break;
      case definitions.condition_enum_entity.threeOrMore:
        isPrerequisiteSatisfied = prerequisitesCompleted >= 3;
        break;
      default:
        isPrerequisiteSatisfied = prerequisitesCompleted >= this.goals[index].prerequisiteGoals.length;
    }

    let isSunsetSatisfied = false;
    switch (this.goals[index].sunsetType) {
      case definitions.condition_enum_entity.oneOrMore:
        isSunsetSatisfied = sunsetsCompleted >= 1;
        break;
      case definitions.condition_enum_entity.twoOrMore:
        isSunsetSatisfied = sunsetsCompleted >= 2;
        break;
      case definitions.condition_enum_entity.threeOrMore:
        isSunsetSatisfied = sunsetsCompleted >= 3;
        break;
      default:
        isSunsetSatisfied = sunsetsCompleted >= this.goals[index].sunsetGoals.length;
    }

    //default to must have completed all
    const isActive = isPrerequisiteSatisfied && !isSunsetSatisfied;
    return isActive;
  }

  Push(session: GoalSession) {
    this.goals.push(session);
  }

  Get(i: number): GoalSession {
    return this.goals[i];
  }

  Length(): number {
    return this.goals.length;
  }

  private goals: Array<GoalSession>;
}

export class Location {
  constructor() {
    this.locationName = "";
    this.locationEnum = "";
    this.fileSet = new Array<string>();
  };

  locationName: string;
  locationEnum: string;
  fileSet: Array<string>;
}

export function ChooseToPlayCampaign(): void {
  const locations = new Map<String, Location>();
  for (let incoming of LostBoys.locations) {
    let location = new Location();
    location.locationName = incoming.locationName;
    location.locationEnum = incoming.locationEnum;
    location.fileSet.push(incoming.startingGateFile);
    for (let file of incoming.extraFiles) {
      location.fileSet.push(file);
    }
  }

  const sessions = new GoalSessionCollection();
  for (let goal of LostBoys.goals) {
    let location = locations.get(goal.location);
    if (location !== undefined) {
      let json = new ReadOnlyJsonMultipleCombined(location.fileSet);
      let happener = new Happener(json);
      let s = new GoalSession(happener, json.GetStartingThingsInAMap(), json.GenerateSolutionNodesMappedByInput());
      s.prerequisiteGoals = goal.prerequisiteGoals;
      s.prerequisiteType = goal.prerequisiteType;
      s.goalName = goal.goalName;
      s.goalEnum = goal.goalEnum;
      s.sunsetGoals = goal.sunsetGoals;
      s.sunsetType = goal.sunsetType;
      sessions.Push(s);
    }
  }

  while (true) {
    // list the sections to choose from
    for (let i = 0; i < sessions.Length(); i++) {
      let book = sessions.Get(i);
      console.log("" + i + ". " + book.GetTitle() + (sessions.IsActive(i) ? "  active" : "  locked") + (book.playable.IsCompleted() ? "  COMPLETE!" : "  incomplete"));
    }

    // ask which section they want to play?
    const choice = prompt("Choose an option or (b)ack: ").toLowerCase();
    if (choice == 'b')
      break;// break the while(true);
    const number = Number(choice);
    if (number < 0 || number >= sessions.Length()) {
      console.log("out-of-range");
      break;
    }

    // now play the book
    const session = sessions.Get(number);
    PlayPlayable(session.playable);

  }// end while true of selecting a section

}// end fn
