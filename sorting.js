let values = [];
const sleepTime = 10;

var idx1 = -1;
var idx2 = -1;
var aux;

let size = 650;

let info_cmp, info_swp;
let swp_cnt = 0;
let cmp_cnt = 0;
let done = true;
let timer;
let speed;

function setup() {
  createElement('h1', 'Sorting Visualized');
  

  createCanvas(size, size);
  for (let i = 0; i < size; i++) {
    values.push(i);
  }
  
  createP('Speed');
  createSpan('Fast');
  speed = createSlider(0, 100, 50, 1);
  createSpan('Slow');
  timer = createP('');

  createButton('Reset').mousePressed(doReset);

  createButton('Shuffle').mousePressed(doShuffle);

  createButton('Reverse').mousePressed(doReverse);

  createButton('BubbleSort').mousePressed(bubbleSort);

  createButton('ShakerSort').mousePressed(shakerSort);

  createButton('InsertionSort').mousePressed(insertionSort);

  createButton('ShellSort').mousePressed(shellSort);

  createButton('HeapSort').mousePressed(heapSort);

  createElement('p', 'Serial Version of:   ');
  createButton('QuickSort').mousePressed(quickSort);
  createButton('MergeSort').mousePressed(mergeSort);

  createElement('p', 'Parallel Version of: ');
  createButton('QuickSort').mousePressed(quickSortParallel);
  createButton('MergeSort').mousePressed(mergeSortParallel);


  info_cmp = createElement('h2', 'Compare Count = 0');
  info_swp = createElement('h2', 'Swap Count    = 0');
}

function draw() {
  background(0);
  for (let i = 0; i < values.length; i++) {
    stroke(255);
    if (i == idx1) stroke('red');
    if (i == idx2) stroke('blue');
    line(i, height, i, height - values[i]);
  }
  timer.html('Time between comparations = '+ speed.value() + ' ms')
}

function doReset() {
  values = Array.from(Array(650).keys());
  done = true;
  info_cmp.html('Compare Count = 0');
  info_swp.html('Swap Count    = 0');
  swp_cnt = 0;
  cmp_cnt = 0;
}

function doShuffle() {
  values = shuffle(values);
  done = false;
  info_cmp.html('Compare Count = 0');
  info_swp.html('Swap Count    = 0');
  swp_cnt = 0;
  cmp_cnt = 0;
}

function doReverse() {
  values = reverse(values);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function visualCompare(arr, a, b) {
  idx1 = a;
  idx2 = b;
  //Sleep so that sort can be visualized
  await sleep(speed.value());
  idx1 = -1;
  idx2 = -1;
  cmp_cnt++;
  info_cmp.html('Compare Count = ' + cmp_cnt);
  return arr[a] > arr[b];
}

function swap(arr, a, b) {
  [arr[a], arr[b]] = [arr[b], arr[a]];
  swp_cnt++;
  info_swp.html('Swap Count    = ' + swp_cnt);
}

async function bubbleSort() {
  var sorted = false;
  var comp;
  var lower_limit = 0;
  var upper_limit = values.length;
  while (!sorted) {
    sorted = true;
    var u = upper_limit;
    for (let i = lower_limit; i < u; i++) {
      if (i > values.length - 2) break;
      if (i < 0) continue;
      comp = await visualCompare(values, i, i + 1);
      if (comp) {
        swap(values, i, i + 1);
        sorted = false;
        upper_limit = i + 2;
      }
      if (sorted) lower_limit = i - 2;
    }
  }
  done = true;
}

async function shakerSort() {
  var sorted = false;
  var comp;
  var lower_limit = 0;
  var upper_limit = values.length;
  while (!sorted) {
    sorted = true;
    var u = upper_limit;
    for (let i = lower_limit; i < u; i++) {
      if (i > values.length - 2) break;
      if (i < 0) continue;
      comp = await visualCompare(values, i, i + 1);
      if (comp) {
        swap(values, i, i + 1);
        sorted = false;
        upper_limit = i + 2;
      }
      if (sorted) lower_limit = i - 2;
    }
    var l = lower_limit
    for (let i = upper_limit; i >= l; i--) {
      if (i < 1) break;
      if (i > values.length - 1) continue;
      comp = await visualCompare(values, i - 1, i);
      if (comp) {
        swap(values, i - 1, i);
        sorted = false;
        lower_limit = i - 2;
      }
      if (sorted) upper_limit = i + 2;
    }
  }
  done = true;
}

async function insertionSort() {
  var comp;
  for (let j = values.length - 1; j > 0; j--) {
    for (let i = j - 1; i < values.length; i++) {
      comp = await visualCompare(values, i, i + 1);
      if (comp) {
        swap(values, i, i + 1);
      } else {
        break;
      }
    }
  }
}



async function shellSort() {
  var gap;
  //var gaps = [1]; 
  var gaps = [1, 4, 10, 23, 57, 132, 301, 701, 1750]; //ciura sequence
  var biggest = gaps.slice(-1)[0];
  while (biggest < values.length) {
    biggest = gaps.slice(-1)[0] * 3 + 1;
    gaps.push(biggest);
  }
  var comp;
  do {
    gap = gaps.pop();

    if (gap < 1) gap = 1;
    for (let j = values.length - 1; j > gap - 1; j--) {
      for (let i = j - gap; i + gap - 1 < values.length; i += gap) {
        comp = await visualCompare(values, i, i + gap);
        if (comp) {
          swap(values, i, i + gap);
        } else {
          break;
        }
      }
    }
  } while (gap > 1)
  done = true;
}


async function heapSort() {
  const n = values.length;
  // Build heap (rearrange array) 
  for (let i = ceil(n / 2) - 1; i >= 0; i--)
    await heapify(values, n, i);

  // One by one extract an element from heap 
  for (let i = n - 1; i >= 0; i--) {
    // Move current root to end 
    swap(values, 0, i);

    // call max heapify on the reduced heap 
    await heapify(values, i, 0);
  }
}

async function heapify(arr, limit, root) {
  var largest = root; // Initialize largest as root 
  var l = 2 * root + 1; // left = 2*i + 1 
  var r = 2 * root + 2; // right = 2*i + 2 

  var comp;
  // If left child is larger than root
  comp = false;
  if (l < limit) comp = await visualCompare(arr, l, largest);
  if (comp)
    largest = l;

  comp = false;
  if (r < limit) comp = await visualCompare(arr, r, largest);
  // If right child is larger than largest so far 
  if (comp)
    largest = r;

  // If largest is not root 
  if (largest != root) {
    swap(arr, root, largest);

    // Recursively heapify the affected sub-tree 
    await heapify(arr, limit, largest);
  }
}

async function mergeSortParallel() {
  await recurseMergeSort(values, 0, values.length, true);
}

async function mergeSort() {
  await recurseMergeSort(values, 0, values.length, false);
}

async function recurseMergeSort(arr, idx_low, idx_high, parallel) {
  if (idx_low == idx_high) return;
  let idx_mid = int((idx_high + idx_low) / 2);

  if (parallel) {
    var x = recurseMergeSort(arr, idx_low, idx_mid, true);
    var y = recurseMergeSort(arr, idx_mid + 1, idx_high, true);
    await x;
    await y;
  } else {
    await recurseMergeSort(arr, idx_low, idx_mid, false);
    await recurseMergeSort(arr, idx_mid + 1, idx_high, false);
  }

  await merge(arr, idx_low, idx_mid, idx_high);
}

async function merge(arr, idx_low, idx_mid, idx_high) {

  //merging
  var comp;
  var i = idx_high; // Initial index of first subarray 
  var j = idx_mid; // Initial index of second subarray 
  while (i >= idx_low && j >= idx_low) {
    comp = await visualCompare(arr, j, i);
    if (comp) // if element of first subarray >  element of second subarray 
    {
      var x = arr[j]; //get j
      arr.splice(j, 1); //remove j
      arr.splice(i, 0, x); //insert at i
      swp_cnt++;
      info_swp.html('Swap Count    = ' + swp_cnt);
      j--;
    } else {
      i--;
      if (i == j) j--;
    }
  }
}



async function quickSort() {
  await recurseQuickSort(values, 0, values.length, false);
}

async function quickSortParallel() {
  await recurseQuickSort(values, 0, values.length, true);
}

async function recurseQuickSort(arr, idx_low, idx_high, parallel) {
  if (idx_high - idx_low <= 0) return;


  var pivot = floor(idx_low + (idx_high - idx_low) / 2);
  if (pivot != idx_low) {
    swap(values, pivot, idx_low);
    pivot = idx_low;
  }
  for (let i = pivot; i < idx_high; i++) {
    comp = await visualCompare(arr, pivot, i);
    if (comp) {
      swap(values, i, pivot);
      swap(values, i, pivot + 1);
      pivot++;
    }
  }
  if (parallel) {
    var y = recurseQuickSort(arr, pivot + 1, idx_high, true);
    var x = recurseQuickSort(arr, idx_low, pivot, true);
    await y;
    await x;
  } else {
    await recurseQuickSort(arr, pivot + 1, idx_high, false);
    await recurseQuickSort(arr, idx_low, pivot, false);
  }
}
