/*
    ASMA - Arpad's Special Math Arts (N-Ellipse module)
    Copyright (C) 2026 Árpád Fekete

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
class NEllipseConstruction {
  constructor(width, height, method) {
    if (width === undefined)
      this._width = 1366;
    else
      this._width = width;
    if (height === undefined)
      this._height = 768;
    else
      this._height = height;
    if (method === undefined)
      this._method = 'distance';
    else
      this._method = method;

    this._points = [];
    this._pointslen = 0;
    this._lines = [];
    this._lineslen = 0;
    this._stopped = true;

    this._sqdist_modulo = 1000;
    this._sqrt_dividedby = 15;
    this._res_modulo = 360;
  }

  addPoint(x, y, weight) {
    if (x === undefined)
       return false;
    if (y === undefined)
       return false;

    this._points[this._pointslen] = {};
    this._points[this._pointslen].x = x;
    this._points[this._pointslen].y = y;
    this._points[this._pointslen].xdest = x;
    this._points[this._pointslen].ydest = y;
    if (weight === undefined)
      this._points[this._pointslen].weight =
      this._points[this._pointslen].weightdest = 1;
    else // may be often e.g. -1
      this._points[this._pointslen].weight =
      this._points[this._pointslen].weightdest = weight;
    this._pointslen++;
  }

  addLine(Ax, Ay, Bx, By, weight) {
    if (Ax === undefined)
       return false;
    if (Ay === undefined)
       return false;
    if (Bx === undefined)
       return false;
    if (By === undefined)
       return false;
    if (Ax === Bx && Ay === By)
       return false;

    this._lines[this._lineslen] = {};
    this._lines[this._lineslen].Ax = Ax;
    this._lines[this._lineslen].Ay = Ay;
    this._lines[this._lineslen].Bx = Bx;
    this._lines[this._lineslen].By = By;
    // (By-Ay)*x+(Ax-Bx)*y=(By-Ay)*Ax+(Ax-Bx)*By
    this._lines[this._lineslen].C = (By-Ay)*Ax+(Ax-Bx)*By;
    this._lines[this._lineslen].D = (By-Ay)*(By-Ay)+(Bx-Ax)*(Bx-Ax)
    if (weight === undefined)
      this._lines[this._lineslen].weight =
      this._lines[this._lineslen].weightdest = 1;
    else // may be often e.g. -1
      this._lines[this._lineslen].weight =
      this._lines[this._lineslen].weightdest = weight;
    this._lineslen++;
  }

  getValue(x, y) {
    var value = 0;
    var distvalue = 0;
    var valuex = 0;
    var valuey = 0;
    for (let cv = 0; cv < this._pointslen; cv++) {
      if (this._method === 'distance') {
        value += this._points[cv].weight * Math.sqrt(
          (this._points[cv].x - x) * (this._points[cv].x - x) +
          (this._points[cv].y - y) * (this._points[cv].y - y));
      } /*else if (this._method === 'gravity') {
        value = this._points[cv].weight * 100000000 / (
          (this._points[cv].x - x) * (this._points[cv].x - x)+
          (this._points[cv].y - y) * (this._points[cv].y - y));
        distvalue = Math.sqrt(
          (this._points[cv].x - x) * (this._points[cv].x - x) +
          (this._points[cv].y - y) * (this._points[cv].y - y));
        valuex += value * (this._points[cv].x - x) / distvalue;
        valuey += value * (this._points[cv].y - y) / distvalue;
      }*/ else if (this._method === 'usermodulo') {
        value += this._points[cv].weight * ((
          (this._points[cv].x - x) * (this._points[cv].x - x) +
          (this._points[cv].y - y) * (this._points[cv].y - y)) % this._sqdist_modulo);
      } else if (this._method === 'sindistance') {
        value += Math.sin( this._points[cv].weight * 
          Math.sqrt(
          (this._points[cv].x - x) * (this._points[cv].x - x) +
          (this._points[cv].y - y) * (this._points[cv].y - y)
          ) / this._sqrt_dividedby
        );
      } else if (this._method === 'experimental') {
        value += this._points[cv].weight * ((
          (this._points[cv].x - x) * (this._points[cv].x - x) +
          (this._points[cv].y - y) * (this._points[cv].y - y)) //% this._sqdist_modulo
);
      }
    }

    var nvx = 0;
    var nvy = 0;
    var C2 = 0;
    var linepointx = 0;
    var linepointy = 0;

    // equation of the line AB
    // (By-Ay)*ux+(Ax-Bx)*uy=(By-Ay)*Ax+(Ax-Bx)*By=C
    // equation of the line orthogonal to AB through point (x,y)
    // (Bx-Ax)*ux+(By-Ay)*uy=(Bx-Ax)*x+(By-Ay)*y=C2

    // solve system of 2 equations for ux and uy!
    // (Bx-Ax)*(By-Ay)*ux+(Bx-Ax)*(Ax-Bx)*uy=(Bx-Ax)*C
    // (Bx-Ax)*(By-Ay)*ux+(By-Ay)*(By-Ay)*uy=(By-Ay)*C2
    // uy*((By-Ay)*(By-Ay)+(Bx-Ax)*(Bx-Ax))=(By-Ay)*C2-(Bx-Ax)*C
    // uy = ( (By-Ay)*C2-(Bx-Ax)*C ) / ( (By-Ay)*(By-Ay)+(Bx-Ax)*(Bx-Ax) )
    // As (Ax,Ay)!=(Bx,By) this will be OK
    // (By-Ay)*(By-Ay)*ux+(Ax-Bx)*(By-Ay)*uy=(By-Ay)*C
    // (Ax-Bx)*(Bx-Ax)*ux+(Ax-Bx)*(By-Ay)*uy=(Ax-Bx)*C2
    // ux*((By-Ay)*(By-Ay)+(Bx-Ax)*(Bx-Ax))=(By-Ay)*C+(Bx-Ax)*C2
    // ux = ( (By-Ay)*C+(Bx-Ax)*C2 ) / ( (By-Ay)*(By-Ay)+(Bx-Ax)*(Bx-Ax) )

/*
    for (let cv = 0; cv < this._lineslen; cv++) {
      // helper variables
      nvx = this._lines[cv].Bx - this._lines[cv].Ax;
      nvy = this._lines[cv].By - this._lines[cv].Ay;
      C2 = nvx*x+nvy*y;
      // linepoint is the intersection of line through (x,y)
      linepointx = (nvy*this._lines[cv].C+nvx*C2) / this._lines[cv].D;
      linepointy = (nvy*C2-nvx*this._lines[cv].C) / this._lines[cv].D;
      if (this._method === 'distance') {
        value += this._lines[cv].weight * Math.sqrt(
          (linepointx - x) * (linepointx - x) +
          (linepointy - y) * (linepointy - y));
      } else if (this._method === 'usermodulo') {
        value += this._lines[cv].weight * ((
          (linepointx - x) * (linepointx - x) +
          (linepointy - y) * (linepointy - y)) % this._sqdist_modulo);
      } else if (this._method === 'sindistance') {
        value += Math.sin( this._lines[cv].weight * 
          Math.sqrt(
          (linepointx - x) * (linepointx - x) +
          (linepointy - y) * (linepointy - y)
          ) / this._sqrt_dividedby
        );
      } else if (this._method === 'experimental') {
        value += this._lines[cv].weight * Math.sqrt(
          ((linepointx - x) * (linepointx - x) +
          (linepointy - y) * (linepointy - y)) % this._sqdist_modulo) / this._sqrt_dividedby;
      }
    }
*/
    if (this._method === 'sindistance') {
      return value / this._pointslen;
    } else if (this._method === 'experimental') {
      return value;//Math.sqrt(value);
    }
    return value;
  }
  
  // This algorithm is not as nice as others online,
  // but I wanted to make it unique for licencing reasons...
  hueToRGB(hue) {
    if (hue === undefined) {
      hue = 0;
    } else if (hue < 0) {
      hue = hue + 1;
    } else if (hue > 1) {
      hue = hue - 1;
    }
    let g0 = 0;
    if (hue < 1/6) g0 = hue * 6;
    else if (hue < 1/2) g0 = 1;
    else if (hue < 2/3) g0 = 4 - hue * 6;
    hue = hue + 1/3;
    if (hue > 1) hue = hue - 1;
    let r0 = 0;
    if (hue < 1/6) r0 = hue * 6;
    else if (hue < 1/2) r0 = 1;
    else if (hue < 2/3) r0 = 4 - hue * 6;
    hue = hue + 1/3;
    if (hue > 1) hue = hue - 1;
    let b0 = 0;
    if (hue < 1/6) b0 = hue * 6;
    else if (hue < 1/2) b0 = 1;
    else if (hue < 2/3) b0 = 4 - hue * 6;
    return { r: r0 * 255, g: g0 * 255, b: b0 * 255};
  }
  
  drawOnCanvas(canv) {
    if (canv === undefined)
      return;
    var ctx = canv.getContext('2d');

    ctx.clearRect(0, 0, this._width, this._height);

    var imdata = ctx.getImageData(0,0, this._width, this._height);
    var ps = imdata.data;
    var offset, value, huev, rgb;
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        offset = x + y * this._width;
        value = this.getValue(x, y);
        if (this._method === 'experimental') {
          //huev = (value + 1) / 2;
          //rgb = this.hueToRGB(huev);
          huev = (Math.floor(value)) % this._res_modulo;
          rgb = this.hueToRGB(huev / this._res_modulo);
        } else if (this._method === 'sindistance') {
          huev = (value + 1) / 2;
          rgb = this.hueToRGB(huev);
        } else {
          huev = Math.floor(value) % this._res_modulo;
          rgb = this.hueToRGB(huev / this._res_modulo);
        }
        ps[offset * 4] = rgb.r;
        ps[offset * 4 + 1] = rgb.g;
        ps[offset * 4 + 2] = rgb.b;
        ps[offset * 4 + 3] = 255;
      }
    }
    ctx.putImageData(imdata, 0, 0);

    //for (let x = 0; x < this._width; x++) {
    //  for (let y = 0; y < this._height; y++) {
    //    ctx.fillStyle = this.valueToColorString2(this.getValue(x,y));
    //    ctx.fillRect(x, y, 1, 1);
    //  }
    //}
  }

}

function imagesize_changed() {
  var selectel = document.getElementById('imagesize');
  var selval = selectel.options[selectel.selectedIndex].value;
  var widthel = document.getElementById('imagesize_width');
  var heightel = document.getElementById('imagesize_height');
  switch(selval) {
    case "choose":
      break;
    case "s640x480":
      widthel.value = 640;
      heightel.value = 480;
      break;
    case "s800x600":
      widthel.value = 800;
      heightel.value = 600;
      break;
    case "s1024x768":
      widthel.value = 1024;
      heightel.value = 768;
      break;
    case "s1366x768":
      widthel.value = 1366;
      heightel.value = 768;
      break;
    case "screen":
    default:
      widthel.value = screen.width;
      heightel.value = screen.height;
  }
  selectel.selectedIndex = 0;
}

function letsee() {
  var ourcanvas = document.getElementById('wallpaper');
  var mainmenu = document.getElementById('mainmenu');
  var widthel = document.getElementById('imagesize_width');
  var heightel = document.getElementById('imagesize_height');

  mainmenu.classList.add("nodisplay");
  mainmenu.classList.remove("display");
  ourcanvas.classList.add("display");
  ourcanvas.classList.remove("nodisplay");
  // TODO: IE9?

  var new_width = widthel.value;
  var new_height = heightel.value;
  // TODO: validate!

  ourcanvas.width = new_width;
  ourcanvas.height = new_height;
  ourcanvas.style.width = new_width+'px';
  ourcanvas.style.height = new_height+'px';

  var selectel = document.getElementById('imagemethod');
  var selval = selectel.options[selectel.selectedIndex].value;
  switch(selval) {
    case "distance":
    case "usermodulo":
    case "sindistance":
    case "experimental":
      break;
    default:
      selval = "distance";
  }

  var amac = new NEllipseConstruction(new_width, new_height, selval);

  var sqel = document.getElementById('sqdist_modulo');
  var sqrtel = document.getElementById('sqrt_dividedby');
  var resmod = document.getElementById('res_modulo');
  amac._sqdist_modulo = sqel.value;
  amac._sqrt_dividedby = sqrtel.value;
  amac._res_modulo = resmod.value;
  // TODO: validate, etc.

  amac.addPoint(Math.floor(Math.random()*amac._width),Math.floor(Math.random()*amac._height),1);
  amac.addPoint(Math.floor(Math.random()*amac._width),Math.floor(Math.random()*amac._height),1);
  amac.addPoint(Math.floor(Math.random()*amac._width),Math.floor(Math.random()*amac._height),1);
  amac.addPoint(Math.floor(Math.random()*amac._width),Math.floor(Math.random()*amac._height),1);
  amac.addPoint(Math.floor(Math.random()*amac._width),Math.floor(Math.random()*amac._height),1);
  amac.addPoint(Math.floor(Math.random()*amac._width),Math.floor(Math.random()*amac._height),1);
  amac.addPoint(Math.floor(Math.random()*amac._width),Math.floor(Math.random()*amac._height),1);

  amac.drawOnCanvas(ourcanvas);

  ourcanvas.onmousedown = function(event) {
    if (event.which == 1) {
      mainmenu.classList.add("display");
      mainmenu.classList.remove("nodisplay");
      ourcanvas.classList.add("nodisplay");
      ourcanvas.classList.remove("display");
    }
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}

