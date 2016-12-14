import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { TemplateRef, ViewContainerRef } from '@angular/core';


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


@Directive({ selector: '[start]' })
export class Elements_With_Start_Class implements OnInit{
  static DictOFElementsWithStart:Dict_OF_Elements_With_Start_Interface = {};  ///// key string, value Elements_With_Start_Interface

  this_start: number|string;

  @Input() start: number|string;
  @Input() contains:string;
  @Input() id:string;

  constructor(private el: ElementRef,  private viewContainer: ViewContainerRef)
  {

  }
  ngOnInit () {
    let err:string;
    if (this.id === undefined){
      err = "Element with start='" + this.start + "' require and id tag";
      alert(err);throw err;
    }

    Elements_With_Start_Class.DictOFElementsWithStart[this.id] = {
      id:this.id,
      tagname:this.el.nativeElement.tagName,
      start:(' ' + this.start).slice(1),
      contains: this.contains,
      el:this.el // document.getElementById(this.el.nativeElement.id)   //this.el
    };
   }
}

/*
@HostListener('mousenter') onMouseEnter() {
    this.old = this.el.nativeElement.style.backgroundColor;
    this.highlight(this.myHighlight);
}

@HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.old);
}
*/
