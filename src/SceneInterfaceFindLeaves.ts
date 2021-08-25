import { SolutionNodeMap } from './SolutionNodeMap';

export interface SceneInterfaceFindLeaves {
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
    GetSetOfStartingAll(): Set<string>;
}