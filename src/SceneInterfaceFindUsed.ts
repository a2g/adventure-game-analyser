import { SolutionNodeMap } from './SolutionNodeMap';

export interface SceneInterfaceFindUsed {
    GetArrayOfProps(): Array<string>;
    GetArrayOfInvs(): Array<string>;
    GetSolutionNodesMappedByInput(): SolutionNodeMap;
}