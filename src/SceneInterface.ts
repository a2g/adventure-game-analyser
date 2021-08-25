import { SceneInterfaceFindLeaves } from './SceneInterfaceFindLeaves';
import { SceneInterfaceConcoct } from './SceneInterfaceConcoct';
import { SceneInterfaceFindUsed } from './SceneInterfaceFindUsed';
import { SceneInterfacePlayThru } from './SceneInterfacePlayThru';
import { SceneInterfaceHappener } from './SceneInterfaceHappener';
import { SceneInterfaceCollater } from './SceneInterfaceCollater';

export interface SceneInterface
    extends SceneInterfacePlayThru,
    SceneInterfaceConcoct,
    SceneInterfaceFindLeaves,
    SceneInterfaceFindUsed,
    SceneInterfaceHappener {

    
}