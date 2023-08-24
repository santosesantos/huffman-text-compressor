import * as fs from "fs";
import TreeNode from "./models/TreeNode.js";
import IElements from "./models/interfaces/IElements.js";

interface IHashCode {
	element: string;
	code: string;
}

var isFileDone = false;

async function waitFileOperation() {
	while(!isFileDone) {
		console.log("Loading file operation...")
	}
	console.log("File operation completed.")
}

const elementNodes = new Array<TreeNode>();

// Read a .txt file and generate a pseudo-binary file from its characters
fs.readFile("./build/lorem.txt", (err, data) => {
	let binaryText = "";

	if (err)
		return console.error(err);

	for (let hex of data) {
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

	// Writing pseudo-binary file with the "bit-stream" text
	fs.writeFile("./build/pseudo-binary-lorem.txt", binaryText, (err) => {
		if (err)
			return console.error(err);
	});
});

const hashMap = new Array<IHashCode>(elementNodes.length);

// Function to search and populate a "hash table"
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
					element: (<IElements>root.value).char,
					code: nodeCode
				};
				break;
			}
		}
	}
}

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

// Mapping the HashMap
treeExplorer(elementNodes[0]);

// TODO - Generate a new "compressed" file

// aaaabbccdddef
const txt = "000010110110010011111111111011100";

var resultTxt = "";
var buffer = "";

for (let i = 0; i < txt.length; i++) {
	buffer += txt.charAt(i);
	for (let j = 0; j < hashMap.length; j++) {
		if (buffer === hashMap[j].code) {
			resultTxt += hashMap[j].element;
			buffer = "";
			break;
		}
	}
}

console.log(resultTxt);