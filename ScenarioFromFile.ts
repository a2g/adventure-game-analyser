import { SolutionNodeMap } from './SolutionNodeMap';
import { SolutionNode } from './SolutionNode';
import { assert } from 'console';
import scenario from './20210415JsonPrivate/scenario/schema/HighScene.json';
import objects from './20210415JsonPrivate/scenario/schema/HighObjects.json';
import _ from './20210415JsonPrivate/scenario/schema/Script/Script.json';
import { MixedObjectsAndVerb } from './MixedObjectsAndVerb';
import { Happenings } from './Happenings';
import { Happening } from './Happening';
import { Happen } from './Happen';
import { Mix } from './Mix';
import { ScenarioInterface } from './ScenarioInterface';
import * as fs from "fs";


    /*
class ScenarioFromFile implements ScenarioInterface {

    contructor(filename: string) {
       const text = fs.readFileSync("20210415JsonPrivate/scenario/schema", { encoding: "UTF-8" });
        auto jsonResult = JSON.parse(text);
    }

    GetSetOfStartingProps(): Set<string>;
    GetArrayOfStartingInvs(): Set<string>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetStartingThingsForCharacter(name: string): Set<string>;
    GetSetOfStartingInvs(): Set<string>;
    GetSetOfStartingThings(): Set<[string, string]>;
    GetArrayOfCharacters(): Array<string>;
    
    setOfStartingProps: Set<string>;
    arrayOfStaringInvs: Set<string>;

}
  */