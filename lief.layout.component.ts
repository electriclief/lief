import {Component, OnInit, ElementRef, DoCheck, AfterContentInit, AfterViewInit, Input, Renderer} from '@angular/core';

import {Lief} from './lief.layout.factory';
import {Elements_With_Start_Class} from './FindElementsWithAttrStart';
import {BehaviorSubject, ReplaySubject} from "rxjs";
import {isUndefined} from "util";
import {Elements_With_Start_Interface} from './FindElementsWithAttrStart';


@Component({
  selector: 'lief',
  template: `<ng-content></ng-content>`,
  styles: [],
  providers: [],
})
export class LiefLayoutClass implements AfterViewInit {

  static Layouts: Array<LiefLayoutClass> = [];
  static LayoutsHandled: boolean = false;
  static MasterLayout: Lief.Container;

  static Handler: Lief.HandlerClass;

  @Input() contains: string;
  _vertical:boolean = false;

  @Input() set vertical(name: string) {
    if (name != undefined) {
      this._vertical = true
    }
  }

  @Input() id: string;

  latest_coords = [];
  el: ElementRef;
  obs: ReplaySubject<any>;

  constructor(el: ElementRef, private renderer: Renderer) {
//    console.log("count push calls -----------------------------------------");
    LiefLayoutClass.Layouts.push(this);
    this.el = el;
  }

  ngAfterViewInit() {
    let err: string;

    if (!LiefLayoutClass.LayoutsHandled) {
      LiefLayoutClass.LayoutsHandled = true;
      setTimeout(() => {
        this.init()
      }, 50);
    }
  }

  recurse(ThisLiefLayoutClass: LiefLayoutClass): Lief.Container {

    let err:string;
    let true_is_hor = false;
    let new_list: Array<Lief.Item> = [];
    let new_recurse:Lief.Container;
    let foundflag = false;

    if (ThisLiefLayoutClass._vertical === false)
      true_is_hor = true;
    for (let LiefItemId of ThisLiefLayoutClass.contains.split("|")) {

      if (!(LiefItemId in Elements_With_Start_Class.DictOFElementsWithStart)) {
        err = LiefItemId + " Either Missing, or 'start' attribute missing";
        alert(err);throw err;
      }
      let ElementWithStart_of_LiefItemId: Elements_With_Start_Interface = Elements_With_Start_Class.DictOFElementsWithStart[LiefItemId];

      if(ElementWithStart_of_LiefItemId.contains === undefined){
        new_list.push(Lief.NewItem(LiefItemId, ElementWithStart_of_LiefItemId.start));
      }
      else {
        for (let ThisLiefLayoutClass of LiefLayoutClass.Layouts) {
          if (ThisLiefLayoutClass.contains === ElementWithStart_of_LiefItemId.contains) {
            new_recurse = this.recurse(ThisLiefLayoutClass);
            new_list.push(Lief.NewItem(LiefItemId, ElementWithStart_of_LiefItemId.start, new_recurse));
            foundflag = true;
            break;
          }
        }
        if (!foundflag) {
          err = "How Did it not find itself? Couldn't find 'contains=\"" + ElementWithStart_of_LiefItemId.contains + "\"' in Dom";
          alert(err);throw err;
        }
      }
    }
    return Lief.NewContainer(ThisLiefLayoutClass.id, true_is_hor, new_list);
  }

  parse_data(root_layout: LiefLayoutClass) {
    return (this.recurse(root_layout));

  }

  init() {
    let root_layout: LiefLayoutClass = LiefLayoutClass.Layouts[0];

    LiefLayoutClass.MasterLayout = this.parse_data(root_layout);

    console.log(LiefLayoutClass.MasterLayout);

    LiefLayoutClass.Handler = Lief(LiefLayoutClass.MasterLayout);

    /*
     this.obs.subscribe((new_coordinates: Lief.CoordObject) => {
     ///////////////////////////////////////////////////////////////////////////////////////
     console.log("Read Observable " + JSON.stringify(new_coordinates));
     let v: any;
     let s: any;
     if (JSON.stringify(new_coordinates).length > 5) {
     console.log(new_coordinates);
     this.latest_coords = [];
     for (let key in new_coordinates) {
     v = new_coordinates[key];
     s = [key, v.x, v.y, v.width, v.height];
     this.latest_coords.push([key, v.x, v.y, v.width, v.height])


     }
     console.log(this.latest_coords);

     }
     //////////////////////////////////////////////////////////////////////////////////////////

     }
     );
     */
  }


  close() {
//    this.LiefHandler.close()
  }
}
