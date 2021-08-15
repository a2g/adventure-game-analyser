import { SolutionNodeMap } from './SolutionNodeMap';

export interface ScenarioInterfaceConcoct {
    GetSetOfStartingProps(): Set<string>;
    GetSetOfStartingInvs(): Set<string>;
    GetSetOfStartingThings(): Set<[string, string]>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetStartingThingsForCharacter(name: string): Set<string>;
    GetArrayOfCharacters(): Array<string>;
}