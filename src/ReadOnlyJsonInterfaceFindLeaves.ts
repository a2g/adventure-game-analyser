import { SolutionNodeMap } from './SolutionNodeMap';

export interface SceneInterfaceFindLeaves {
    GenerateSolutionNodesMappedByInput(): SolutionNodeMap;
    GetMapOfAllStartingThings(): Map<string, Set<string>>;
}
