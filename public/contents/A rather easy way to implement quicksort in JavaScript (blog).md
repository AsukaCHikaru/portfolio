---
created: 2023/06/01 22:35
title: A Rather Easy Way to Implement Quicksort in JavaScript
published: 2019-05-23
language: en-US
pathname: a-rather-easy-way-to-implement-quicksort-in-js
category: Programming
tags:
  - Algorithm
filename: A rather easy way to implement quicksort in JavaScript (blog)
---
Don't use in-place swap.

Declare 2 new array `left` and `right` (or anything you want to call them). After comparing each element to pivot, push it to `left` if it's smaller or `right` if it's bigger than pivot. Then `return [...quickSort(left), pivot, ...quickSort(right)]` will do the magic.

Of course it's not as good space efficiency-wise, but it's way easier to implement and understand.

Example code:

```js
function quickSort(arr){
	if(arr.length <= 1) return arr;
	else {
		let pivot = arr.pop();
		let len = arr.length;
		let left = [];
		let right = [];
		for(let i = 0; i < len; i++){
			if(arr[i] >= pivot) right.push(arr[i]);
			else left.push(arr[i]);
		}
		return [...quickSort(left), pivot, ...quickSort(right)];
	}
}
```