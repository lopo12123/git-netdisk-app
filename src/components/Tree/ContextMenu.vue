<template>
    <a-menu class="context-menu"
            mode="vertical"
            :selectable="false">
        <a-menu-item key="Expansion" class="item"
                     @click="menuItem('Expansion')">
            展开/关闭
        </a-menu-item>

        <a-menu-item key="Explorer" class="item"
                     @click="menuItem('Explorer')">
            在Explorer中打开
        </a-menu-item>
    </a-menu>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Menu, MenuItem} from "ant-design-vue";

export default defineComponent({
    name: "ContextMenu",
    components: {
        AMenu: Menu,
        AMenuItem: MenuItem,
    },
    setup(prop, ctx) {
        const menuItem = (type: 'Expansion' | 'Explorer') => {
            ctx.emit('itemClick', type)
        }

        return {
            menuItem
        }
    }
})
</script>

<style lang="scss" scoped>
.context-menu {
    position: absolute;
    z-index: 10000;
    border: solid 1px #dddddd;
    border-radius: 5px;
    box-shadow: 5px 5px 10px #dddddd;

    ::v-deep {
        .item {
            height: 30px;
            color: #777777;
            font-size: 12px;
            line-height: 30px;
            user-select: none;
            &:hover {
                background-color: #e6f7ff;
            }
        }
    }
}
</style>
