const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
    const random = Math.floor(Math.random() * array.length);
    return array[random];
}

const storyText = '今天气温 34 摄氏度，:inserta:出去遛弯。当走到:insertb:门前时，突然就:insertc:。人们都惊呆了，李雷全程目睹但并没有慌，因为:inserta:是一个 130 公斤的胖子，天气又辣么热。';
const insertA = ['怪兽威利', '大老爹', '圣诞老人'];
const insertB = ['肯德基', '迪士尼乐园', '白宫'];
const insertC = ['自燃了', '在人行道化成了一坨泥', '变成一条鼻涕虫爬走了'];

randomize.addEventListener('click', result);

function result() {
    let newStory = storyText;
    const aItem = randomValueFromArray(insertA);
    const bItem = randomValueFromArray(insertB);
    const cItem = randomValueFromArray(insertC);

    newStory = newStory.replaceAll(':inserta:', aItem).replaceAll(':insertb:', bItem).replaceAll(':insertc:', cItem);

    if (customName.value !== '') {
        let name = customName.value;
        newStory = newStory.replaceAll('李雷', name);
    }

    if (document.getElementById("american").checked) {
        let weight = `${Math.round(130 * 2.2)} 磅`;
        let temperature = `${Math.round(34 * 1.8 + 32)} 华氏度`;
        newStory = newStory.replaceAll('34 摄氏度', temperature).replaceAll('130 公斤', weight);
    }

    story.textContent = newStory;
    story.style.visibility = 'visible';
}
