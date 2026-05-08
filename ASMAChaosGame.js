/*
    ASMA - Arpad's Special Math Arts (Chaos Game module)
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
class ChaosGameConstruction {
  constructor(width, height, fractal, color_w) {
    if (width === undefined)
      this._width = 640;
    else
      this._width = width;
    if (height === undefined)
      this._height = 480;
    else
      this._height = height;
    if (!fractal)
      this._fractal = "cuberoot";
    else
      this._fractal = fractal;
    switch (fractal) {
      case 'sierpinski':
      case 'goldensi':
      case 'silversi':
        this._corner0x = 0;
        this._corner0y = -1.9;
        this._corner1x = -1.9 * this._width / this._height;
        this._corner1y = 1.9;
        this._corner2x = 1.9 * this._width / this._height;
        this._corner2y = 1.9;
        this._ratio = 0.5;
        break;
      case 'cuberoot':
      default:
        this._cx = Math.random() * 2 - 1;
        this._cy = Math.random() * 2 - 1;
        break;
    }
    if (fractal === 'goldensi') {
      this._ratio = 2 / (Math.sqrt(5) + 1);
    } else if (fractal === 'silversi') {
      this._corner3x = (this._corner0x + this._corner1x + this._corner2x) / 3;
      this._corner3y = (this._corner0y + this._corner1y + this._corner2y) / 3;
    }
    this._centersx = Math.round(this._width/2);
    this._centersy = Math.round(this._height/2);
    this._origosx = 0;
    this._origosy = 0;
    this._origox = 0;
    this._origoy = 0;
    this._zoom = this._height / 4;
    this._colorWeight = Math.round(color_w);
    if (this._colorWeight < 1) {
      this._colorWeight = 1;
    }
  }
  
  setCenter(origosx, origosy) {
    let vectorsx = origosx - this._centersx;
    let vectorsy = origosy - this._centersy;
    let vectorx = vectorsx / this._zoom;
    let vectory = vectorsy / this._zoom;
    this._origox = this._origox + vectorx;
    this._origoy = this._origoy + vectory;   
    this._origosx = this._origox * this._zoom;
    this._origosy = this._origoy * this._zoom;
  }
  
  setZoom(zoom) {
    this._zoom = this._zoom * zoom;
  }
  
  coloring(colorRed, colorGreen, colorBlue, whichroot) {
    let addRed = 0;
    let addGreen = 0;
    let addBlue = 0;
    switch (whichroot) {
      case 0:
        addRed = 255;
        break;
      case 1:
        addGreen = 255;
        break;
      case 2:
        addBlue = 255;
        break;
      default:
        addRed = (colorGreen + colorBlue) / 2;
        addGreen = (colorRed + colorBlue) / 2;
        addBlue = (colorRed + colorGreen) / 2;
        colorRed = addRed;
        colorGreen = addGreen;
        colorBlue = addBlue;
        break;
    }
    colorRed = Math.round((colorRed * this._colorWeight + addRed) / (this._colorWeight + 1));
    colorGreen = Math.round((colorGreen * this._colorWeight + addGreen) / (this._colorWeight + 1));
    colorBlue = Math.round((colorBlue * this._colorWeight + addBlue) / (this._colorWeight + 1));
    return [colorRed, colorGreen, colorBlue];
  }
  
  sierpinski(x, y, whichroot) {
    switch (whichroot) {
      case 0:
        x = x * this._ratio + this._corner0x * (1 - this._ratio);
        y = y * this._ratio + this._corner0y * (1 - this._ratio);
        break;
      case 1:
        x = x * this._ratio + this._corner1x * (1 - this._ratio);
        y = y * this._ratio + this._corner1y * (1 - this._ratio);
        break;
      case 2:
      default:
        x = x * this._ratio + this._corner2x * (1 - this._ratio);
        y = y * this._ratio + this._corner2y * (1 - this._ratio);
        break;
    }
    return [x,y];
  }
  
  sierpinski2(x, y, whichroot) {
    switch (whichroot) {
      case 0:
        x = x * this._ratio + this._corner0x * (1 - this._ratio);
        y = y * this._ratio + this._corner0y * (1 - this._ratio);
        break;
      case 1:
        x = x * this._ratio + this._corner1x * (1 - this._ratio);
        y = y * this._ratio + this._corner1y * (1 - this._ratio);
        break;
      case 2:
        x = x * this._ratio + this._corner2x * (1 - this._ratio);
        y = y * this._ratio + this._corner2y * (1 - this._ratio);
        break;
      case 3:
      default:
        x = x * this._ratio + this._corner3x * (1 - this._ratio);
        y = y * this._ratio + this._corner3y * (1 - this._ratio);
        let vectorx = this._corner3x - x;
        let vectory = this._corner3y - y;
        x = this._corner3x + vectorx;
        y = this._corner3y + vectory;
        
        let cornerSmall = Math.floor(Math.random() * 3);
        let cornerSmall0x = this._corner0x * this._ratio + this._corner3x * (1 - this._ratio);
        let cornerSmall0y = this._corner0y * this._ratio + this._corner3y * (1 - this._ratio);
        let vectortempx = this._corner3x - cornerSmall0x;
        let vectortempy = this._corner3y - cornerSmall0y;
        cornerSmall0x = this._corner3x + vectortempx;
        cornerSmall0y = this._corner3y + vectortempy;
        let cornerSmall1x = this._corner1x * this._ratio + this._corner3x * (1 - this._ratio);
        let cornerSmall1y = this._corner1y * this._ratio + this._corner3y * (1 - this._ratio);
        vectortempx = this._corner3x - cornerSmall1x;
        vectortempy = this._corner3y - cornerSmall1y;
        cornerSmall1x = this._corner3x + vectortempx;
        cornerSmall1y = this._corner3y + vectortempy;
        let cornerSmall2x = this._corner2x * this._ratio + this._corner3x * (1 - this._ratio);
        let cornerSmall2y = this._corner2y * this._ratio + this._corner3y * (1 - this._ratio);
        vectortempx = this._corner3x - cornerSmall2x;
        vectortempy = this._corner3y - cornerSmall2y;
        cornerSmall2x = this._corner3x + vectortempx;
        cornerSmall2y = this._corner3y + vectortempy;
        switch (cornerSmall) {
          case 0:
            x = x * this._ratio + cornerSmall0x * (1 - this._ratio);
            y = y * this._ratio + cornerSmall0y * (1 - this._ratio);
            break;
          case 1:
            x = x * this._ratio + cornerSmall1x * (1 - this._ratio);
            y = y * this._ratio + cornerSmall1y * (1 - this._ratio);
            break;
          case 2:
          default:
            x = x * this._ratio + cornerSmall2x * (1 - this._ratio);
            y = y * this._ratio + cornerSmall2y * (1 - this._ratio);
            break;
        }    
        break;
    }
    return [x,y];
  }
  
  cuberootFractal(x, y, whichroot) {
    x -= this._cx;
    y -= this._cy;
    let polarR = Math.sqrt(x*x+y*y);
    let polarAlfa = 0;
    if (polarR > 0) {
      polarAlfa = (y >= 0)?Math.acos(x/polarR):-Math.acos(x/polarR);
    }
    switch (whichroot) {
      case 0:
        polarAlfa += 2*Math.PI;
        break;
      case 1:
        polarAlfa -= 2*Math.PI;
        break;
      case 2:
      default:
        break;
    }
    polarR = Math.cbrt(polarR);
    polarAlfa = polarAlfa / 3;
    x = polarR * Math.cos(polarAlfa);
    y = polarR * Math.sin(polarAlfa);
    return [x,y];
  }

  drawOnCanvas(canv, iterations) {
    if (canv === undefined)
      return;
    var ctx = canv.getContext('2d');
    ctx.clearRect(0, 0, this._width, this._height);
    var imdata = ctx.getImageData(0,0, this._width, this._height);
    var ps = imdata.data;
    
    for (let x = 0; x < this._width; x++) {
      for (let y = 0; y < this._height; y++) {
        let offset = x + y * this._width;
        ps[offset * 4] = 0;
        ps[offset * 4 + 1] = 0;
        ps[offset * 4 + 2] = 0;
        ps[offset * 4 + 3] = 255;
      }
    }
    
    let x = 0;//Math.random() * 4 - 2;
    let y = 0;//Math.random() * 4 - 2;
    let screenx = 0;
    let screeny = 0;
    
    let colorRed = 130;
    let colorGreen = 130;
    let colorBlue = 130;
    let xy = [0,0];
    
    for (let i = 0; i < iterations; i++) {
      let whichroot = Math.floor(Math.random() * 3);
      if (this._fractal === 'silversi') {
        whichroot = Math.floor(Math.random() * 4);
      }
      switch (this._fractal) {
        case 'sierpinski':
        case 'goldensi':
          xy = this.sierpinski(x, y, whichroot);
          x = xy[0];
          y = xy[1];
          break;
        case 'silversi':
          xy = this.sierpinski2(x, y, whichroot);
          x = xy[0];
          y = xy[1];
          break;
        case 'cuberoot':
        default:
          xy = this.cuberootFractal(x, y, whichroot);
          x = xy[0];
          y = xy[1];
          break;
      }
      
      let col = this.coloring(colorRed, colorGreen, colorBlue, whichroot);
      colorRed = col[0];
      colorGreen = col[1];
      colorBlue = col[2];
      
      screenx = (this._centersx - this._origosx) + Math.round(x * this._zoom);
      screeny = (this._centersy - this._origosy) + Math.round(y * this._zoom);
      
      if (screenx < 0) {
        screenx = 0;
      } else if (screenx >= this._width) {
        screenx = this._width - 1;
      }
      if (screeny < 0) {
        screeny = 0;
      } else if (screeny >= this._height) {
        screeny = this._height - 1;
      }
      if (i < 100) {
        continue;
      }
      let offset = Math.round(screenx) + Math.round(screeny) * this._width;
      ps[offset * 4] = colorRed;
      ps[offset * 4 + 1] = colorGreen;
      ps[offset * 4 + 2] = colorBlue;
      ps[offset * 4 + 3] = 255;
    }
    ctx.putImageData(imdata, 0, 0);
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
    case "s8400x6000":
      widthel.value = 8400;
      heightel.value = 6000;
      break;
    case "s640x480":
      widthel.value = 640;
      heightel.value = 480;
      break;
    case "s1366x768":
      widthel.value = 1366;
      heightel.value = 768;
      break;
    case "s2732x1536":
      widthel.value = 2732;
      heightel.value = 1536;
      break;
    case "screen":
    default:
      widthel.value = screen.width;
      heightel.value = screen.height;
  }
  selectel.selectedIndex = 0;
}

function iterations_changed() {
  var selectel = document.getElementById('iterations');
  var selval = selectel.options[selectel.selectedIndex].value;
  var itel = document.getElementById('custom_iter');
  switch(selval) {
    case "choose":
      break;
    case "i1000000000":
      itel.value = 1000000000;
      break;
    case "i100000000":
      itel.value = 100000000;
      break;
    case "i10000000":
      itel.value = 10000000;
      break;
    case "i1000000":
    default:
      itel.value = 1000000;
      break;
  }
  selectel.selectedIndex = 0;
}

function topng() {
  var ourcanvas = document.getElementById('wallpaper');
  window.open(ourcanvas.toDataURL('image/png'));
}

function letsee() {
  var ourcanvas = document.getElementById('wallpaper');
  var mainmenu = document.getElementById('mainmenu');
  var widthel = document.getElementById('imagesize_width');
  var heightel = document.getElementById('imagesize_height');
  var itel = document.getElementById('custom_iter');
  var fractal = document.getElementById('fractal');
  var color_weight_element = document.getElementById('color_weight');

  var new_width = widthel.value;
  var new_height = heightel.value;
  var color_weight = color_weight_element.value;
  if (!color_weight) {
    color_weight = 1;
  }

  ourcanvas.width = new_width;
  ourcanvas.height = new_height;
  ourcanvas.style.width = new_width+'px';
  ourcanvas.style.height = new_height+'px';

  var gsc = new ChaosGameConstruction(new_width, new_height, fractal.value, color_weight);
  gsc.drawOnCanvas(ourcanvas, itel.value);
  // MAX_SAFE_INTEGER =       9007199254740991

  window.oncontextmenu = function (event) {
    event.preventDefault();
    return false;
  }

  ourcanvas.onmousedown = function(event) {
    const rect = ourcanvas.getBoundingClientRect();
    const xn = event.clientX - rect.left;
    const yn = event.clientY - rect.top;
    
    gsc.setCenter(xn, yn);
    
    if (event.which == 1) {
      gsc.setZoom(1.5);
    } else if (event.which == 3) {
      gsc.setZoom(1/1.5);
    }
    
    gsc.drawOnCanvas(ourcanvas, itel.value);
    
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}

