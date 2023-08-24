import TreeNode from "./models/TreeNode.js";

// Populate the tree
const numbers = [4, 5, 52, 44, 32, 98, 100];

function insertNode(node: TreeNode, currentNode: TreeNode) {
	if (node.value < currentNode.value) {
		if (currentNode.left) {
			insertNode(node, currentNode.left);
		} else {
			currentNode.left = node;
		}
	} else {
		if (currentNode.right) {
			insertNode(node, currentNode.right);

		} else {
			currentNode.right = node;
		}
	}
}

var root: TreeNode | null = null;

numbers.forEach(element => {
	const newNode = new TreeNode(element);

	if (!root) {
		// Is the first node
		root = newNode;
	} else {
		insertNode(newNode, root);
	}
});

// Show the tree
const tree: TreeNode = root ?? new TreeNode(0);
console.log(tree);