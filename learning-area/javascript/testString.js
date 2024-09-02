function countDiffMaxLength(str) {

    let length = 0;

    if (str) {

        let maxLength = 1;
        let start = 0;

        for (let i = 1; i < str.length; i++) {

            if (str.substring(start, i).indexOf(str.charAt(i)) === -1) {

                maxLength++;

            } else {

                start = i;

                if (maxLength > length) {

                    length = maxLength;

                }

                maxLength = 1;

            }

        }

    }

    return length;

}

const str = 'abcabcdeaabbcc';

console.log(countDiffMaxLength(str));