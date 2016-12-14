 lief (Alpha 1.0) under *active* development - should finish by Christmas<br>
#Angular 2 screen layout manager

    import {Component} from '@angular/core';

    @Component({
      selector: 'app-root',
      template: `
      <lief id="MasterLayout" vertical="yup" contains="Header|MidFrame|Footer">
          <lief id="MidFrame" contains="Tree|Router" start="100%"></lief>
        <div id="Header" start="80px">InsideTree</div>
        <div id="Tree" start="120px">InsideTree</div>
        <div id="Router" start="100%">InsideRouter</div>
        <div id="Footer" start="80px">InsideTree</div> 
    </lief>
    `,
      styles: [`
    #Header {background-color: green;position: absolute}
    #Tree {background-color: blue;position: absolute}
    #Router {background-color: magenta;position: absolute}
    #Footer {background-color: cyan;position: absolute}

    `]
    })
    export class AppComponent {}
