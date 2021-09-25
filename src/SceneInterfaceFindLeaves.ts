import { SolutionNodeMap } from './SolutionNodeMap';

export interface SceneInterfaceFindLeaves {
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetMapOfAllStartingThings(): Map<string, Set<string>>;
}