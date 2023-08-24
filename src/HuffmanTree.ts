import * as fs from "fs";
import * as url from "url";
import TreeNode from "./models/TreeNode.js";
import IElements from "./models/interfaces/IElements.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

interface IHashCode {
	character: string;
	code: string;
}

const elementNodes = new Array<TreeNode>();

// Read a .txt file and generate a pseudo-binary file from its characters
console.info("Reading the lorem.txt file...");
const loremData = fs.readFileSync(__dirname + "assets/lorem.txt");
var binaryText = "";

for (let hex of loremData) {
	// Generate a "bit-stream" text from the code of the characters
	let binary = hex.toString(2);
	while (binary.length < 8) {
		binary = '0' + binary;
	}
	binaryText += binary;

	// Populate the elementNodes array
	let currentChar = String.fromCharCode(hex);

	if (elementNodes.length == 0) {
		elementNodes.push(new TreeNode({
			char: currentChar,
			freq: 1
		}));
	} else {
		for (let i = 0; i < elementNodes.length; i++) {
			const element = (<IElements>elementNodes[i].value);
			if (element.char == currentChar) {
				element.freq++;
				break;
			}

			if (i == elementNodes.length - 1) {
				elementNodes.push(new TreeNode({
					char: currentChar,
					freq: 1
				}));
				break;
			}
		}
	}
}

console.info("Creating a pseudo-binary-lorem.txt file...");
// Writing pseudo-binary file with the "bit-stream" text
fs.writeFile(__dirname + "assets/pseudo-binary-lorem.txt", binaryText, (err) => {
	if (err)
		return console.error(err);
});

const hashMap = new Array<IHashCode>(elementNodes.length);

// Function to search the tree and populate a "hash table"
function treeExplorer(root: TreeNode, nodeCode: string = "") {
	if (typeof root.value == "number") {
		// Explore first child
		treeExplorer(root.left!, nodeCode + '0');
		// Explore second child
		treeExplorer(root.right!, nodeCode + '1');
		return;
	} else {
		for (let i = 0; i < hashMap.length; i++) {
			if (!hashMap[i]) {
				hashMap[i] = {
					character: (<IElements>root.value).char,
					code: nodeCode
				};
				break;
			}
		}
	}
}

console.info("Creating the tree...");
// Loop until the whole tree is built
while (elementNodes.length > 1) {
	// Each index in this array carries [indexOfNode, Node]
	let minorFreqs = new Array<[number, TreeNode]>(2);

	// Get the index of the minorFreqs to splice out of the array after node creation
	elementNodes.forEach((element, i) => {
		if (minorFreqs[0]) {
			let currentFreq, firstMinorFreq;

			// Assigning the frequency of the current node
			if (typeof element.value === "number")
				currentFreq = element.value;
			else
				currentFreq = element.value.freq;

			// Assigning the frequency of the first minor node
			if (typeof minorFreqs[0][1].value === "number")
				firstMinorFreq = minorFreqs[0][1].value;
			else
				firstMinorFreq = minorFreqs[0][1].value.freq;

			// Comparisons
			if (currentFreq < firstMinorFreq) {
				let temp = minorFreqs[0];
				minorFreqs[0] = [i, element];
				minorFreqs[1] = temp;
			} else if (minorFreqs[1]) {
				let secondMinorFreq;
				// Assigning the frequency of the second minor node
				if (typeof minorFreqs[1][1].value === "number")
					secondMinorFreq = minorFreqs[1][1].value;
				else
					secondMinorFreq = minorFreqs[1][1].value.freq;

				if (currentFreq < secondMinorFreq) {
					minorFreqs[1] = [i, element];
				}
			} else {
				minorFreqs[1] = [i, element];
			}
		} else {
			minorFreqs[0] = [i, element];
		}
	});

	// Create a node from 2 elements
	let firstMinorFreq, secondMinorFreq;

	// Assigning the frequency of the first minor node
	if (typeof minorFreqs[0][1].value === "number")
		firstMinorFreq = minorFreqs[0][1].value;
	else
		firstMinorFreq = minorFreqs[0][1].value.freq;

	// Assigning the frequency of the second minor node
	if (typeof minorFreqs[1][1].value === "number")
		secondMinorFreq = minorFreqs[1][1].value;
	else
		secondMinorFreq = minorFreqs[1][1].value.freq;

	const totalFreq = firstMinorFreq + secondMinorFreq;

	const newNode = new TreeNode(
		totalFreq,
		minorFreqs[0][1],
		minorFreqs[1][1]
	);

	// Splice out minorFreqs nodes and insert the new node
	elementNodes.splice(minorFreqs[0][0], 1, newNode);
	elementNodes.splice(minorFreqs[1][0], 1);
}

console.info("Creating characters code table...");
// Mapping the HashMap
treeExplorer(elementNodes[0]);

console.info("Generating a compressed-pseudo-binary-lorem.txt file...");
// Generate a new "compressed" file
var compressedBinaryText = "";

for (let hex of loremData) {
	let currentChar = String.fromCharCode(hex);

	for (let element of hashMap) {
		if (element.character == currentChar) {
			compressedBinaryText += element.code;
			break;
		}
	}
}

fs.writeFileSync(__dirname + "assets/compressed-pseudo-binary-lorem.txt", compressedBinaryText);

console.info("Generating a result-lorem.txt file from the compressed file...");
// Decompress compressed file
const compressedLoremData = fs.readFileSync(__dirname + "assets/compressed-pseudo-binary-lorem.txt");

var resultTxt = "";
var buffer = "";

for (let hex of compressedLoremData) {
	buffer += String.fromCharCode(hex);

	for (let element of hashMap) {
		if (buffer === element.code) {
			resultTxt += element.character;
			buffer = "";
			break;
		}
	}
}

fs.writeFileSync(__dirname + "assets/result-lorem.txt", resultTxt);

console.info("Program finished successfully! Files created in 'build/assets/' directory.");