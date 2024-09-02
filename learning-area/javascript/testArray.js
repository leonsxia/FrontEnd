function removeElements(nums, val) {

    for (let i = 0; i < nums.length; ) {

        if (nums[i] === val) {

            nums.splice(i, 1);

        } else {

            i++;

        }
    }

    return nums.length;

}

const nums = [2, 3, 3, 3, 2];
const val = 3;

console.log(removeElements(nums, val));