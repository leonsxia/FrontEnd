<template>
    <div class="my-canvas-wrapper">
        <canvas ref="my-canvas" class="my-canvas"></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return {
            provider: {
                context: null,
            },
        };
    },

    provide() {
        return {
            provider: this.provider,
        };
    },

    mounted() {
        this.provider.context = this.$refs['my-canvas'].getContext('2d');

        const width = 500;
        const height = 500 * 9 / 16;
        const scale = window.devicePixelRatio;
        this.$refs['my-canvas'].style.width = `${width}px`;
        this.$refs['my-canvas'].style.height = `${height}px`;
        this.$refs['my-canvas'].width = width * scale;
        this.$refs['my-canvas'].height = height * scale;
        this.provider.context.scale(scale, scale);
    },
};
</script>

<style scoped>
.my-canvas {
    border-radius: 10px;
    box-shadow: 1px 3px 3px 1px #333;
}
</style>