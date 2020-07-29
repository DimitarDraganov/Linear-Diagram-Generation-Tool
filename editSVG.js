//import * as myModule  from 'd3.js';

var svgCode = localStorage.getItem("svg");
var downloadName = "linear.svg";
var row1;
var row2;
var col1;
var col2;
var num1;
var num2;
var guides;

var selectedItems = new Array();

function init() {
    //gets Guides from local storage
    guides = localStorage.getItem("guides");
    //Updates Guides to reflect appropriate on page and diagram.
    if (guides == 'lines') {
        document.getElementById('guidesNone').checked = false;
        document.getElementById('guidesBackground').checked = false;
        document.getElementById('guidesLines').checked = true;
        svgCode = localStorage.getItem("svg");//Gets Svg string from local storage.

        document.getElementById('showSVG').innerHTML = svgCode;	//draws image

        // const s = document.getElementById('showSVG');
        // s.addEventListener('click', (e) => { console.log(e);});
        //const s = document.getElementById('pet');
        //s.addEventListener('click', (e) => { console.log(e.AT_TARGET);});


        //var s = d3.select('showSVG').html(svgCode);

        //var s = d3.select('showSVG');

        //var circle = s.append('circle');
        //const circle = g.append('circle');


         //const svgq = d3.select('showSVG');

         //const widthq = +svgq.attr('width');
         //const heightq = +svgq.attr('height');

        // const g = svgq.append('g')
        //     .attr('transform', `translate(${widthq / 2}, ${heightq / 2})`);



        //.on('click', () => console.log("sss"));


        //d3.selection.prototype.appendSVG = 
        //d3.selection.enter.prototype.appendSVG = function(svgCode) {
        //return this.select(function() {
        //return this.appendChild(document.importNode(new DOMParser()
        //				.parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + SVGString + '</svg>', 'application/xml').documentElement.firstChild, true)); }); 
        //};



        //var svg = d3.selectAll('showSVG').appendHTML(showSVG);





        //const s = document.getElementById('showSVG');
        //s.addEventListener('click', e => { console.log(e.target);});

    } else if (guides == 'background') {
        document.getElementById('guidesNone').checked = false;
        document.getElementById('guidesBackground').checked = true;
        document.getElementById('guidesLines').checked = false;
        svgCode = guidesBackground();//removes guides for image.
        document.getElementById('showSVG').innerHTML = svgCode;	//draws image
    } else if (guides == 'none') {
        document.getElementById('guidesNone').checked = true;
        document.getElementById('guidesBackground').checked = false;
        document.getElementById('guidesLines').checked = false;
        svgCode = guidesNone();//removes guides for image.
        document.getElementById('showSVG').innerHTML = svgCode;	//draws image
    }



    function addingSelectedItems(selectedItem){
        var e = selectedItem.target.textContent;
        selectedItems.push(e);
    }

    const listener = document.getElementById('showSVG');
    listener.addEventListener('click', e => { addingSelectedItems(e);});

    // const listener = document.getElementById('showSVG');
    // listener.addEventListener('click', e => { console.log(e.target);});



    //Date used for saving file.
    var date = new Date();
    downloadName = "linear-" + date.getMinutes() + date.getSeconds() + date.getMilliseconds() + ".svg";
    //Labels used to populate list box and select prio for sorting.
    var labels = labelListBox();
    document.getElementById('labelListBox').innerHTML = labels;
    var prioLabels = localStorage.getItem("prioLabels");//retrieves priority labels from local storage
    var prioNum = localStorage.getItem("prioNum");//retrieves priority line numbers from local storage.
    //displays any selected prioity labels.
    document.getElementById('prioList').innerHTML = prioList();
}
//Function used to pass values to swap rows function (from form)
function rows() {
    swapRows(document.getElementById('row1').value, document.getElementById('row2').value);//see SVGTools.js
}

function newRows() {
    newSwapRows(selectedItems[0], selectedItems[1]);//see SVGTools.js
}

//Function used to pass values to swap cols function (from form)
function cols() {
    swapCols(document.getElementById('col1').value, document.getElementById('col2').value);//see SVGTools.js
}
//Function for reording diagram with minimum line spaces
function reorder() {
    orderGaps();//see SVGTools.js
}
//Function to change guides to boxes
function background() {
    guidesBackground();
}
//Function to remove guides
function none() {
    guidesNone();
}
//Function to change guides selected on page
function changeGuides() {
    //Function will check to see which radio box is checked and update the variable accordingly
    if (document.getElementById('guidesLines').checked == true) {
        guides = 'lines';
        localStorage.setItem("guides", guides);
    } else if (document.getElementById('guidesNone').checked == true) {
        guides = 'none';
        localStorage.setItem("guides", guides);
    } else if (document.getElementById('guidesBackground').checked == true) {
        guides = 'background';
        localStorage.setItem("guides", guides);
    }
}
//Function used to reorder diagram based on priority lines.
function orderForce() {
    var svgCode = localStorage.getItem("svg");
    var temp = localStorage.getItem("prioNum");
    //Local storage will only save elements as strings, therefor any arrays put in will revert back to strings,
    //the below loop puts the values back into array form.
    var prioNum = new Array();
    for (var i = 0; i < temp.length; i++) {
        prioNum.push(temp[i]);
    }
    //passed the svg string and the array of priority line numbers to the sortForce function (see SVGTools.js)
    sortForce(prioNum);
}
//Function used to save svg image as file
function saveSVG() {
    var svgString = svgCode;
    var blob = new Blob([svgString], {
        type: "text/plain;charset=utf-8;",
    });
    saveAs(blob, getDownloadName());
}
//gets download name, used by saveSVG
function getDownloadName() {
    return downloadName;
}
//Function used to dynamically create and populate listbox containing all available labels.
function labelListBox() {
    var svgString = localStorage.getItem("svg");
    var sections = separateSVG(svgString);
    var lines = sections[1];
    var swapNo = getLineNo(lines);
    var labels = getLabels(lines, swapNo);
    var size = labels.length;
    var ret;
    //creates form with button containing all options available.
    ret = '<form action="editSVG.html">\n';
    ret += '<select id="labelsList" size="' + size + '">\n';
    for (var i = 0; i < labels.length; i++) {
        ret += '<option>' + labels[i] + '</option>\n';
    }
    ret += '</select>\n';
    ret += '<input type="submit" value=">>" onClick = "addToPrio()">\n';
    ret += '</form>\n';
    //returns string for use in HTML page.
    return ret;
}
//Function used to add selected labels from standard list to the priority listbox.
function addToPrio() {
    var svgString = localStorage.getItem("svg");
    var sections = separateSVG(svgString);
    var lines = sections[1];
    var swapNo = getLineNo(lines);
    var labels = getLabels(lines, swapNo);
    var size = labels.length;
    var current;
    var prioLabels = localStorage.getItem("prioLabels");
    var prioNum = localStorage.getItem("prioNum");
    var temp = localStorage.getItem("prioLabels");
    temp = temp.split(",");
    var tempNum = new Array();
    var tempLab = new Array();
    //retrieves all labels, checks to see if it is selected:
    var labelsList = document.getElementById('labelsList');
    for (var i = 0; i < labelsList.length; i++) {
        current = labelsList[i];
        //if selected, adds to priority List providing it isn't already present.
        if (current.selected == true && temp.includes(labels[i]) != true) {
            tempNum.push(i);
            tempLab.push(labels[i]);
            tempLab.push("");
        }
    }
    //adds new prio to the existing list
    prioLabels = prioLabels.concat(tempLab);
    prioNum = prioNum.concat(tempNum);
    //loads updated prio list into local storage.
    localStorage.setItem("prioLabels", prioLabels);
    localStorage.setItem("prioNum", prioNum);
}
//Function used to create and populate priority label listbox.
function prioList() {
    var svgString = localStorage.getItem("svg");
    var sections = separateSVG(svgString);
    var lines = sections[1];
    var swapNo = getLineNo(lines);
    var labels = getLabels(lines, swapNo);
    var size = labels.length;
    var temp = localStorage.getItem("prioLabels");
    //String from local storage required to be turned back into array.
    prioLabels = temp.split(",");
    var ret;
    //creates listbox with options when array is NOT empty
    if (prioLabels != 'null') {
        ret = '<form action="editSVG.html">\n';
        ret += '<select multiple="multiple" id="prioList" size="' + size + '">\n';
        for (var i = 0; i < prioLabels.length; i++) {
            ret += '<option>' + prioLabels[i] + '</option>\n';
        }
        ret += '</select>\n';
        ret += '<input type="submit" value="Order on Prio" onClick = "orderForce()">\n';
        ret += '</form>\n';
    } else {
        //Otherwise creates an emtpy box.
        ret = '<select multiple="multiple" id="prioList" size="' + size + '">\n';
        for (var i = 0; i < labels.length; i++) {
            ret += '<option> </option>\n';
        }
        ret += '</select>\n';
        ret += '<input type="submit" value="Order on Prio" onClick = "orderForce()">\n';
    }
    //returns string for use in HTML.
    return ret;
}
//Function used to remove all items from the priority lists.
function erasePrio() {
    var newPrio = [];
    var newNum = [];

    localStorage.setItem("prioLabels", newPrio);
    localStorage.setItem("prioNum", newNum);
}