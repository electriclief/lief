import {Renderer, ElementRef,  AfterContentInit,  DoCheck, OnInit} from '@angular/core';
import {Observable, BehaviorSubject, ReplaySubject} from "rxjs/Rx";
import {Elements_With_Start_Class, Dict_OF_Elements_With_Start_Interface} from './FindElementsWithAttrStart';

interface stupid_fix {
  (el:Element, x:number, y:number, length:number, width:number):void
}


function getWindowSize() {
  return [window.innerWidth, window.innerHeight];
}

export function Lief(LiefContainer: Lief.Container): Lief.HandlerClass {
  return new Lief.HandlerClass(LiefContainer, undefined);
}
export namespace Lief {
  export let state: Container;

  export interface Position {
    label?: string,
    x: number,
    y: number,
    width: number,
    height: number,
  }
  export interface CoordObject {
    [index: string]: Position
  }


  export interface Item {
    label: string;
    start: Stumbler,
    size: Position,
    is_a_container?: Container,
  }
  export interface Container {
    label: string,
    direction: boolean, // 0 is horizontal, 1 is vertical
    items: Item[],
    margin: number,
    size?: Position,
  }

  export interface Elements_With_Start_Interface {
    id?:string,
    tagname?:string,
    start?:number|string,
    el?:ElementRef
    contains:string,
  }

  export interface Dict_OF_Elements_With_Start_Interface {
    [index: string]: Elements_With_Start_Interface
  }

  export type Stumbler = string | number;
  export let debug: boolean = false;

  export class LiefClass { //implements  OnInit{
    State: Container;
    private items: any;

    constructor(private defined: Container, private renderer: Renderer) {
      this.init(defined)
    }
    private init(defined): void {
      this.State = defined;
    }

    private static _fixed(container: Container, width: number, height: number): number {
      let NOT_DEFINED: number = -999;
      let fixed: number = 0;
      let new_size: number = NOT_DEFINED;

      for (let each_item of container.items) {

        if (typeof each_item.start === "number") {

          new_size = each_item.start;
        }
        else if (typeof each_item.start === "string") {

          if (each_item.start.slice(-2) === "px") {

            new_size = parseInt(each_item.start.slice(0, -2));
          }
        }
        else
          throw "width Parameter must be number or string (with post-fix)";

        if (new_size !== NOT_DEFINED) {
          fixed = fixed + new_size;
          if (!container.direction) {
            each_item.size.width = width - container.margin * 2;
            each_item.size.height = new_size;
          }
          else {
            each_item.size.width = new_size;
            each_item.size.height = height - container.margin * 2
          }
          new_size = NOT_DEFINED;
        }
      }
      return fixed;
    }
    private static _percent(container: Container, width: number, height: number, fixed: number): void {
      let pixels_left_for_percent: number;
      let max = (container.direction) ? width : height;
      pixels_left_for_percent = (max - fixed - container.margin * (container.items.length + 1));
      for (let each_item of container.items)
        if ((typeof each_item.start === "string") && each_item.start.slice(-1) === "%") {
          let new_percent = parseInt(each_item.start.slice(0, -1));

          if (container.direction) {
            each_item.size.width = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));
            each_item.size.height = height - container.margin * 2;
          }
          else {
            each_item.size.width = width - container.margin * 2;
            each_item.size.height = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));

          }
        }
    }
    private static _fill(container: Container, across: number, height: number, x_offset: number = 0, y_offset: number = 0): void {
      let margin = container.margin;
      let sum: number = margin;
      for (let each_item of container.items) {
        if (container.direction) {
          each_item.size.x = x_offset + sum;
          sum = sum + each_item.size.width + margin;
          each_item.size.y = y_offset + margin;
        }
        else {
          each_item.size.x = x_offset + margin;
          each_item.size.y = y_offset + sum;
          sum = sum + each_item.size.height + margin;
        }
      }
    }

    public Update(width: number, height: number, container: Container = this.State,
                  x_offset: number = 0, y_offset: number = 0, include_parents: boolean = false): CoordObject {

      let fixed: number = LiefClass._fixed(container, width, height);
      let ReturnObject: CoordObject = {stupid_fix: {label: "a", x: 0, y: 0, width: 0, height: 0}};
      let IsReturnObjectDefined = false;

      LiefClass._percent(container, width, height, fixed);
      LiefClass._fill(container, width, height, x_offset, y_offset);

      for (let this_item of container.items) {



        let width = this_item.size.width + container.margin * 2;
        let height = this_item.size.height + container.margin * 2;
        let x = this_item.size.x - container.margin;
        let y = this_item.size.y - container.margin;

        if ('is_a_container' in this_item) {

          if (include_parents) {
            ReturnObject[this_item.label] = this_item.size;
          }


          ReturnObject = Object.assign(ReturnObject, this.Update(width, height, this_item.is_a_container, x, y))
        }

        ReturnObject[this_item.label] = this_item.size;
      }

      if (container === this.State)
        this.items = ReturnObject;
      delete ReturnObject['stupid_fix'];

      return ReturnObject;
    }
  }

  export class HandlerClass  {

    private asClass: LiefClass;
    private windowSize$: BehaviorSubject<any>;
    public Current_Size: {width: number,length: number};

    public Behave = new ReplaySubject();

    constructor(public submitted: Container, private renderer: Renderer) {

      this.asClass = new LiefClass(submitted, undefined);
      this.windowSize$ = new BehaviorSubject(getWindowSize());

      Observable.fromEvent(window, 'resize')
        .map(getWindowSize)
        .subscribe(this.windowSize$);
      let subscription = this.windowSize$.subscribe((num: Array<number>) => {
        this.Current_Size = {length: num[0], width: num[1]};
        let Coordinates: any = this.asClass.Update(num[0], num[1]);

        for (let key in Coordinates) {

          let c: Lief.Position = Coordinates[key];
          if (key in Elements_With_Start_Class.DictOFElementsWithStart) {

            let el = Elements_With_Start_Class.DictOFElementsWithStart[key]['el'].nativeElement.id;

            Elements_With_Start_Class.DictOFElementsWithStart[key]['el'].nativeElement.style.left = c.x.toString()+"px";
            Elements_With_Start_Class.DictOFElementsWithStart[key]['el'].nativeElement.style.top = c.y.toString()+"px";
            Elements_With_Start_Class.DictOFElementsWithStart[key]['el'].nativeElement.style.width = c.width.toString()+"px";
            Elements_With_Start_Class.DictOFElementsWithStart[key]['el'].nativeElement.style.height = c.height.toString()+"px";
          }
        }
        this.Behave.next(Coordinates);
      });
    }



    public close(): void {
      this.Behave.complete();
    }

    public SwitchContainer(new_container: Container): void {
      this.asClass.State = new_container;
    }
  }

  export function NewCoordinates(width: number = 0, height: number = 0, x: number = 0, y: number = 0, label: string = null): Position {
    let return_object = {x: x, y: y, width: width, height: height};
    if (name) return_object['label'] = label;
    return return_object;
  }

  export function NewItem(label: string, start: Stumbler, is_a_container: Container = null): Item {
    let ret_val: Item = {label: label, start: start, size: NewCoordinates()};
    if (is_a_container) ret_val['is_a_container'] = is_a_container;
    return ret_val;
  }

  export function NewContainer(label: string, true_is_hor: boolean, items: Item[], margin: number = 4): Container {
    return {
      label: label,
      direction: true_is_hor, // true is horizontal, false is vertical
      items: items,
      margin: margin
    }
  }
}
