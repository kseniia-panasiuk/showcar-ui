console.log('docs2');
console.log('docs234');

Vue.component('code-demo', {
    created() {
        console.log('ctd', this.$el);
    },
    mounted() {
        console.log('mtd', this.$el.innerHTML);
        console.log(this.$slots.default);
    },
    // data() {
    //     return { collapsed: true };
    // },
    props: ['collapsed'],
    replace: false,
    template: '<div class="code-demo"><button @click.prevent="collapsed = !collapsed;">Show/hide</button><div v-show="!collapsed"><slot></slot></div></div>'
});

var app = new Vue({
    el: '.page-container',
    data: {
        message: 'Hello Vue!'
    }
});
