<template>
    <div class="my-game-pad">
        <div class="left-controls">
            <button class="up" @touchstart="onUpPressed" @touchend="onUpUnpressed"><span></span></button>
            <button class="down" @touchstar="onDownPressed" @touchend="onDownUnPressed"><span></span></button>
            <button class="left" @touchstart="onLeftPressed" @touchend="onLeftUnpressed"><span></span></button>
            <button class="right" @touchstart="onRightPressed" @touchend="onRightUnpressed"><span></span></button>
        </div>
        <div class="right-controls">
            <button class="X" @touchstart="onXPressed" @touchend="onXUnpressed"><span>X</span></button>
            <button class="Y" @touchstart="onYPressed" @touchend="onYUnpressed"><span>Y</span></button>
            <button class="A" @touchstart="onAPressed" @touchend="onAUnpressed"><span>A</span></button>
            <button class="B" @touchstart="onBPressed" @touchend="onBUnpressed"><span>B</span></button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GamePad',
    methods: {
        onUpPressed() {
            console.log('up pressed');
            this.$emit('up-pressed');
        },
        onUpUnpressed() {
            console.log('up unpressed');
            this.$emit('up-unpressed');
        },
        onDownPressed() {
            this.$emit('down-pressed');
        },
        onDownUnPressed() {
            this.$emit('down-unpressed');
        },
        onLeftPressed() {
            this.$emit('left-pressed');
        },
        onLeftUnpressed() {
            this.$emit('left-unpressed');
        },
        onRightPressed() {
            this.$emit('right-pressed');
        },
        onRightUnpressed() {
            this.$emit('right-unpressed');
        },
        onXPressed() {
            this.$emit('x-pressed');
        },
        onXUnpressed() {
            this.$emit('x-unpressed');
        },
        onYPressed() {
            this.$emit('y-pressed');
        },
        onYUnpressed() {
            this.$emit('y-unpressed');
        },
        onAPressed() {
            this.$emit('a-pressed');
        },
        onAUnpressed() {
            this.$emit('a-unpressed');
        },
        onBPressed() {
            this.$emit('b-pressed');
        },
        onBUnpressed() {
            this.$emit('b-unpressed');
        }
    }
}
</script>

<style scoped>
.my-game-pad {
    border-radius: 60px;
    background-color: #002D62;
    height: 100%;
}

.my-game-pad button {
    /* disable auto zoom in when rapiddly click on button */
    touch-action: pan-y;
}

.my-game-pad .left-controls {
    width: 125px;
    height: 125px;
    background: #5A4FCF;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(calc(-100% - 260px), -50%);
    border-radius: 60px;
    box-shadow: inset -2px -2px 2px 0px #333;
}

.left-controls button {
    border-radius: 3px;
}

.left-controls .up {
    width: 30px;
    height: 50px;
    background: #545AA7;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: inset -2px -2px 2px 0px #333;
}

.left-controls .up span {
    position: absolute;
    width: 2px;
    height: 10px;
    background-color: #B9D9EB;
    top: 20%;
    left: calc(50% - 1px);
}

.left-controls .right {
    width: 50px;
    height: 30px;
    background: #545AA7;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);
    box-shadow: inset -2px -2px 2px 0px #333;
}

.left-controls .right span {
    position: absolute;
    width: 10px;
    height: 2px;
    background-color: #B9D9EB;
    top: calc(50% - 1px);
    right: 20%;
}

.left-controls .down {
    width: 30px;
    height: 50px;
    background: #545AA7;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    box-shadow: inset -2px -2px 2px 0px #333;
}

.left-controls .down span {
    position: absolute;
    width: 2px;
    height: 10px;
    background-color: #B9D9EB;
    bottom: 20%;
    left: calc(50% - 1px);
}

.left-controls .left {
    width: 50px;
    height: 30px;
    background: #545AA7;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    box-shadow: inset -2px -2px 2px 0px #333;
}

.left-controls .left span {
    position: absolute;
    width: 10px;
    height: 2px;
    background-color: #B9D9EB;
    top: calc(50% - 1px);
    left: 20%;
}

.my-game-pad .right-controls {
    width: 125px;
    height: 125px;
    background: #5A4FCF;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(260px, -50%);
    border-radius: 60px;
    box-shadow: inset -2px -2px 2px 0px #333;
}

.right-controls button {
    border-radius: 50px;
}

.right-controls button span {
    display: contents;
    position: absolute;
    width: 20px;
    height: 20px;
    color: #B9D9EB;
    font-weight: bold;
    top: 50%;
    right: 50%;
    transform: translate(-50%, -50%);
}

.right-controls .X {
    width: 45px;
    height: 45px;
    background: #545AA7;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    box-shadow: inset -2px -2px 2px 0px #333;
}

.right-controls .Y {
    width: 45px;
    height: 45px;
    background: #545AA7;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: inset -2px -2px 2px 0px #333;
}

.right-controls .B {
    width: 45px;
    height: 45px;
    background: #545AA7;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);
    box-shadow: inset -2px -2px 2px 0px #333;
}

.right-controls .A {
    width: 45px;
    height: 45px;
    background: #545AA7;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    box-shadow: inset -2px -2px 2px 0px #333;
}
</style>