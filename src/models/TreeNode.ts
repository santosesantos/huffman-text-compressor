import IElements from "./interfaces/IElements.js";

export default class TreeNode {
	value: number | IElements;

	left: TreeNode | null;
	right: TreeNode | null;

	constructor(value: number | IElements, left: TreeNode | null = null, right: TreeNode | null = null) {
		this.value = value;
		this.left = left;
		this.right = right;
	}
}