#Angular 2 Layout Manager

####Do layouts like this keep you up at night?
```
| 120px |     (100% left)            | 120px |

---------------------------------------------   ---
|Head   |HeadMid                     |   Head|  80px
|Left   |                            |  Right|   
----------------------------------------------  ---
|Menu | Title                                |  60px
|     |---------------------------------------  ---
|     | pic1  | Top                          |  20%
|     |       --------------------------------  ---
|     |-------| Mid                          |
|     | pic2  |                              |
|     |       |                              |  50%
|     |       |                              |
|     |       |------------------------------|  ---
|     |       | Bottom                       |
|     |       |                              |  30%
|     |       |                              |
----------------------------------------------  ---
  
|80px|  20%   |            80%               |
```
lief to the rescue!

```
@Component({
  selector: 'app-root',
  template: `
<lief id="MasterLayout" vertical ="true" contains="Header|picsAndTopMidBottomAndTitleAndMenu">

 <lief id="Header" contains="HeadLeft|HeadMid|HeadRight" start="80px"></lief>
 <lief id="picsAndTopMidBottomAndTitleAndMenu" contains="Menu|picsAndTopMidBottomAndTitle" start="100%"></lief>
 
 <lief id="picsAndTopMidBottomAndTitle" vertical="true" contains="Title|picsAndTopMidBottom" start="100%"></lief>
 
 <lief id="picsAndTopMidBottom" contains="Pics|TopMidBottom" start="100%"></lief>
 
 <lief id="Pics" vertical="true" contains="pic1|pic2" start="20%"></lief> 
 <lief id="TopMidBottom" vertical="true" contains="Top|Mid|Bottom" start="80%"></lief>

 <div id="HeadLeft" start="120px">HeadLeft</div>
 <div id="HeadMid" start="100%">HeadMid</div>
 <div id="HeadRight" start="120px">HeadRight</div>

 <div id="Menu" start="80px">Menu</div>

 <div id="Title" start="60px">Title</div>

 <div id="pic1" start="40%">pic1</div>
 <div id="pic2" start="60%">pic2</div>

 <div id="Top" start="20%">Top</div>
 <div id="Mid" start="50%">Mid</div>
 <div id="Bottom" start="30%">Bottom</div>
  </lief>
`,
  styles: [`div {position: absolute}#HeadLeft{background-color:cyan}#HeadMid{background-color:magenta}
#HeadRight{background-color:green}#Menu{background-color:blue}#Title{background-color:purple}
#pic1{background-color:orange}#pic2{background-color:peru}#Top{background-color:cadetblue}
#Mid{background-color:lemonchiffon}#Bottom{background-color:aquamarine}
`]
})
export class AppComponent {}
```

DONE!

A picture is worth a thousand words:
[See It Work](http://leafdriving.kissr.com/)

just add the three files to your project (anywhre you like)
register them with app.module.ts:
```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { LiefLayoutClass } from './lief.layout.component';                //// add this line
import { Elements_With_Start_Class } from './FindElementsWithAttrStart';  //// add this line


@NgModule({
  declarations: [
    AppComponent,
    LiefLayoutClass,                                ///add this line
    Elements_With_Start_Class,                      ///add this line
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

and you are ready to go.


