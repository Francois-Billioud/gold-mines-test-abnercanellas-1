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
//
//
// ---------------------------------------------------EDIT: 19/02/2022-----------------------------------------------------
//  The other way to solve this, with will reduce the processing time by an order of complexity of sqrt(actual time) is using 
//a Somed Area Table algorithm.
//  The idea is use an auxiliary matrix to store the sum of the positions, as can be seen in this link: https://en.wikipedia.org/wiki/Summed-area_table
//  At the end of this code (attachment 1), i placed , as comment, an incomplete code to sample the possibilities of solve this problem. 
//  The code is not complete, but i think it's a good idea to try it, what i'm doing, btw.
//


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



// ---------------------------------------------------Attachment 1-----------------------------------------------------
/* 
function findBestSpot(landWidth, landHeight, exploitationWidth, exploitationHeight, goldMines) {
    var land = matrix(landWidth, landHeight);
    var aux = matrix(landWidth, landHeight);
    populateLand(land, goldMines);
    aux = preProcess(landWidth, landHeight, land, aux);
    var count = 0;
    var bestSpot = [0,0,0];

    for (let i = 0; i < landWidth - exploitationWidth; i++) {
        for (let j = 0; j < landHeight - exploitationHeight; j++) {
            count = 0;
            count = sumQuery(land, i, j, i + exploitationWidth, j + exploitationHeight);

            bestSpot = bestSpot[2] < count ? [i, j, count] : bestSpot;
        }
    };
    return { //the return the best spot as an object
        coordinates: {
            x: bestSpot[0],
            y: bestSpot[1]
        },
        goldMines: bestSpot[2]
    };
}

function matrix(_landWidth, _landHeight) { 
    if (_landHeight == 0 || _landWidth == 0) {
        return [[]];
    } else {
        return new Array(_landWidth).fill(0).map(() => new Array(_landHeight).fill(0));

    }
}

function populateLand(_land, _goldMines) {
    _goldMines.forEach(item => {
        _land[item.x][item.y] = 1;
    });
    return _land;
}

function preProcess(M, N, _mat, _aux) {

    // Copy first row of _mat[][] to _aux[][]
    for (var i = 0; i < N; i++)
        _aux[i,0] = _mat[0, i];

    // Do column wise sum
    for (var i = 1; i < M; i++)
        for (var j = 0; j < N; j++)
        if(_aux[i][j]) _aux[i][j] = _mat[i][j] + _aux[i - 1][j];

    // Do row wise sum
    for (var i = 0; i < M; i++)
        for (var j = 1; j < N; j++)
            _aux[i][j] += _aux[i][j - 1] ||[];
            

    return _aux;
}

// A O(1) time function to compute sum
// of sub_matrix between (tli, tlj) and
// (rbi, rbj) using aux[][] which is
// built by the preprocess function
function sumQuery(aux, tli, tlj, rbi, rbj) {

    // result is now sum of elements
    // between (0, 0) and (rbi, rbj)
    var res = aux[rbi][rbj];

    // Remove elements between (0, 0)
    // and (tli-1, rbj)
    if (tli > 0)
        res = res - aux[tli - 1][rbj];

    // Remove elements between (0, 0)
    // and (rbi, tlj-1)
    if (tlj > 0)
        res = res - aux[rbi][tlj - 1];

    // Add aux[tli-1][tlj-1] as elements
    // between (0, 0) and (tli-1, tlj-1)
    // are subtracted twice
    if (tli > 0 && tlj > 0)
        res = res + aux[tli - 1][tlj - 1];

    return res;
}

module.exports = findBestSpot;
 */