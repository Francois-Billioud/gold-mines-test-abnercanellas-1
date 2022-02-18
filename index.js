//  *Author:Abner Canellas*
//  *Date: 18/02/2022*
//  *Version: 1.0*
//  To respond to the exercice i imagineted a matrix with the dimensions of the land filled with 0s and the gold mine fields with 1s
//Then i iterated the area from the top left corner. Each column iterate row by row to count the mines within the area
//of the exploration, to, then, update the best spot if the count is greater than the current best spot.
//  On a 6x4 area, a 2x2 exploration and coordinates {(1, 0), (5, 0), (2,2), (3, 3)}, as the exemple:
//|0|1|0|0|0|1|
//|0|0|0|0|0|0|
//|0|0|1|0|0|0|
//|0|0|0|1|0|0|
// 
//  To prevent passing the matrix out of bounds, i subtracted the exploration dimensions from the land dimensions.
//  To gain memory access time, i used an array insted of objects, since , at least in C, arrays are faster than objects 'cause
// they are stored in the memory in a contiguous way.
//
//  i'm with a feeling that this algorithm is not the best way to solve this problem, so i'm will upload this version to mark the
//time taken to solve the exercice with it.
//  Beside that, im thinking about a better way to solve this problem, probaly using a reduce function at a copy of a minor area. This way
//mey be faster. I'm not sure, but i believe that this can be done with the most part of this present algorithm and a most efficient 
//way to crop/copy the explotable area.
//  Other way that im thinking is catch the values of the top left and bottom right corners of the exploration and then sum the n mines within
//this limit values. To facilitate this, the gold mines coordinates can be sorted by the x and y values.



function findBestSpot(landWidth, landHeight, exploitationWidth, exploitationHeight, goldMines) {

    // Starting a initial best spot and a Zero matrix
    let bestSpot = [0, 0, 0];
    let area = matrix(landWidth, landHeight);
    // Populating the area with the gold mines
    populate(area, goldMines);

    // Starting the exploration of the area from the top left corner
    // collumn by column, each column iterated row by row
    for (i = 0; i <= landWidth - exploitationWidth; i++) {
        for (j = 0; j <= landHeight - exploitationHeight; j++) {
            // sum the mines within the area
            let count = minesWithin(i, j, area, exploitationWidth, exploitationHeight)
            // if the count is greater than the current best spot, update the best spot
            bestSpot = bestSpot[2] < count ? [i, j, count] : bestSpot;
        }
    }

    return { //the return the best spot as an object
        coordinates: {
            x: bestSpot[0],
            y: bestSpot[1]
        },
        goldMines: bestSpot[2]
    };
}

function minesWithin(_i, _j, _area, _exploitationWidth, _exploitationHeight) { //count the mines within the area
    let aux = 0; //auxiliary variable to count the mines
    for (m = 0; m < _exploitationWidth; m++) { //iterate the width and the height of the area
        for (n = 0; n < _exploitationHeight; n++) {
            //if the area is a 1, increment the auxiliary variable
            aux += (_area[_i + m][_j + n]);
        }
    }
    return aux;
}

function populate(_area, _goldMines) { // set 1 to the gold mines coordinates in the area
    _goldMines.forEach(item => {
        _area[item.x][item.y] = 1;
    });

}

function matrix(_landWidth, _landHeight) { //create a Zero filled matrix
    // Creating a matrix with the land dimensions
    // and filling it with 0s
    // If the heigth or width is a 0, the matrix will 
    // be treated as a one dimensional array
    if (_landHeight == 0 || _landWidth == 0) {
        return [0];
    } else {
        //else the matrix will be a 2 dimensional array 
        //and filled with 0s to garantee that the area is
        //maleable
        return new Array(_landWidth).fill(0).map(() => new Array(_landHeight).fill(0));
    }
}

module.exports = findBestSpot;
