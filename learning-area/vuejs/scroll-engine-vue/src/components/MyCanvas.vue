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

        this.$refs['my-canvas'].width = 500;
        this.$refs['my-canvas'].height = 500 * 9 / 16;
    },
};
</script>

<style scoped>
.my-canvas {
    border-radius: 10px;
    box-shadow: 1px 3px 3px 1px #333;
}
</style>