declare module 'bitecs' {
  export type Type =
    | 'i8'
    | 'ui8'
    | 'ui8c'
    | 'i16'
    | 'ui16'
    | 'i32'
    | 'ui32'
    | 'f32'
    | 'f64'
    | 'eid'

  export type ListType = readonly [Type, number];
  
  export const Types: {
    i8: "i8"
    ui8: "ui8"
    ui8c: "ui8c"
    i16: "i16"
    ui16: "ui16"
    i32: "i32"
    ui32: "ui32"
    f32: "f32"
    f64: "f64"
    eid: "eid"
  };

  export type TypedArray =
    | Uint8Array
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array

  export type ArrayByType = {
    [Types.i8]: Int8Array;
    [Types.ui8]: Uint8Array;
    [Types.ui8c]: Uint8ClampedArray;
    [Types.i16]: Int16Array;
    [Types.ui16]: Uint16Array;
    [Types.i32]: Int32Array;
    [Types.ui32]: Uint32Array;
    [Types.f32]: Float32Array;
    [Types.f64]: Float64Array;
    [Types.eid]: Uint32Array;
  }

  export enum DESERIALIZE_MODE {
    REPLACE,
    APPEND,
    MAP
  }

  export type ComponentType<T extends ISchema> = {
    [key in keyof T]:
      T[key] extends Type
      ? ArrayByType[T[key]]
      : T[key] extends [infer RT, number]
        ? RT extends Type
          ? Array<ArrayByType[RT]>
          : unknown
        : T[key] extends ISchema
          ? ComponentType<T[key]>
          : unknown;
  };

  export type ComponentProp = TypedArray | Array<TypedArray>

  export interface IWorld {
    [key: string]: any
  }

  export interface ISchema {
    [key: string]: Type | ListType | ISchema
  }

  export interface IComponentProp {
    [key: string]: ComponentProp
  }

  export interface IComponent {
    [key: string]: IComponentProp
  }

  export type Component = IComponent | ComponentType<ISchema>

  export type QueryModifier<W extends IWorld> = (c: (IComponent | IComponentProp)[]) => (world: W) => IComponent | QueryModifier<W>

  export type Query<W extends IWorld> = (world: W, clearDiff?: Boolean) => number[]

  export type System<W extends IWorld, Args extends any[]> = (world: W, ...args: Args) => W

  export type Serializer<W extends IWorld> = (target: W | number[]) => ArrayBuffer
  export type Deserializer<W extends IWorld> = (world: W, packet: ArrayBuffer, mode?: DESERIALIZE_MODE) => number[]

  export function setDefaultSize(size: number): void
  export function createWorld<T extends IWorld>(obj?: T): T
  export function resetWorld<W extends IWorld>(world: W): W
  export function deleteWorld<W extends IWorld>(world: W): void
  export function addEntity<W extends IWorld>(world: W): number
  export function removeEntity<W extends IWorld>(world: W, eid: number): void

  export function registerComponent<W extends IWorld>(world: W, component: Component): void
  export function registerComponents<W extends IWorld>(world: W, components: Component[]): void
  export function defineComponent<T extends ISchema>(schema?: T): ComponentType<T>
  export function defineComponent<T>(schema?: any): T
  export function addComponent<W extends IWorld>(world: W, component: Component, eid: number, reset?: boolean): void
  export function removeComponent<W extends IWorld>(world: W, component: Component, eid: number, reset?: boolean): void
  export function hasComponent<W extends IWorld>(world: W, component: Component, eid: number): boolean
  export function getEntityComponents<W extends IWorld>(world: W, eid: number): Component[]

  export function defineQuery<W extends IWorld>(components: (Component | QueryModifier<W>)[]): Query<W>
  export function Changed<W extends IWorld>(c: Component | ISchema): Component | QueryModifier<W>
  export function Not<W extends IWorld>(c: Component | ISchema): Component | QueryModifier<W>
  export function enterQuery<W extends IWorld>(query: Query<W>): Query<W>
  export function exitQuery<W extends IWorld>(query: Query<W>): Query<W>
  export function resetChangedQuery<W extends IWorld>(world: W, query: Query<W>): Query<W>
  export function removeQuery<W extends IWorld>(world: W, query: Query<W>): Query<W>
  export function commitRemovals<W extends IWorld>(world: W): void

  export function defineSystem<W extends IWorld, Args extends any[]>(update: (world: W, ...args: Args) => W): System<W, Args>

  export function defineSerializer<W extends IWorld>(target: W | Component[] | IComponentProp[] | QueryModifier<W>, maxBytes?: number): Serializer<W>
  export function defineDeserializer<W extends IWorld>(target: W | Component[] | IComponentProp[] | QueryModifier<W>): Deserializer<W>
  
  export function pipe(...fns: ((...args: any[]) => any)[]): (...input: any[]) => any
  
  export const parentArray: Symbol
}
