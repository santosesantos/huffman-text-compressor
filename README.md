# Text compressor - Huffman Coding

## Summary

- [Overview](#overview)
- [How it works](#how-it-works)
  - [The LoremInit file](#the-loreminit-file)
  - [The HuffmanCompressor file](#the-huffmancompressor-file)

## Overview

This project is an implementation of the Huffman Coding for text lossless compression.

It's important to remember that, perhaps, this isn't totally optimal due to the literal tree implementation in TS, without an optimized tree generator library.

## How it works

It takes a ***lorem.txt*** file and generate two *"pseudo-binary file"*: 
  * ***pseudo-binary-lorem.txt***
  * ***compressed-pseudo-binary-lorem.txt***

Then a ***result-lorem.txt*** file is generated from the ***compressed-pseudo-binary-lorem.txt***, using a hashTable that contains the Huffman Codification for each character.

After the program execution, you may verify the size and the content of the files and see the differences between ***pseudo-binary-lorem.txt*** and ***compressed-pseudo-binary-lorem.txt*** to see the result.

*Remember that they are "pseudo-binary" files. So each **byte** means one **bit**.*


#### Why *"pseudo-binary"*
The *"pseudo-binary"* is meant for a .txt file whether each character represents a **bit**.

I did this just for the fact that I couldn't create a literal binary file able to manipulate the "bits", in my OS. 

> *I've spent some time searching for a manipulative binary file creation using JS, but I didn't find something that works yet. Any help is welcome.*

### The LoremInit file

This file creates the ***lorem.txt*** file in the "*build/assets*" directory. The ***lorem.txt*** file is the source file to generate the compressed version.

When you first clone this repo (after using "***npm i***") you may run this script to create the ***lorem.txt*** file:

```
npm run initorem
```

After the creation, you can edit the content of this file as much as you want.

### The HuffmanCompressor file

This file generates all the other files mentioned before in the "*build/assets*" directory.

You may run this script to run the file (after using "***npm run initorem***") :

```
npm run huffman
```
