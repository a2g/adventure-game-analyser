import { SolutionNodeMap } from './SolutionNodeMap';

export interface SceneInterfaceConcoct {
    GetSetOfStartingProps(): Set<string>;
    GetSetOfStartingInvs(): Set<string>;
    GetSetOfStartingThings(): Set<[string, string]>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetStartingThingsForCharacter(name: string): Set<string>;
    GetArrayOfCharacters(): Array<string>;
    GetSetOfStartingEverythings(): Set<string>;
}