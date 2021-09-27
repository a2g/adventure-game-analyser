import { SolutionNodeMap } from './SolutionNodeMap';

export interface SceneInterfaceConcoct {
    GetSetOfStartingProps(): Set<string>;
    GetSetOfStartingInvs(): Set<string>;
    GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
    GetStartingThingsForCharacter(name: string): Set<string>;
    GetArrayOfCharacters(): Array<string>;
    GetMapOfAllStartingThings(): Map<string, Set<string>>;
}