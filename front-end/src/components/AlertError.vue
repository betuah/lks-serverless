<template>
	<VAlert
		v-model="props.visible"
		border="start"
		variant="tonal"
		type="error"
		class="text-caption text-wihite mb-5"
		:text="props.message"
		closable
		@click:close="close"
	/>
</template>

<script setup>
const props = defineProps({
	visible: {
		type: Boolean,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

const emits = defineEmits(["update:visible"]);

const close = () => {
	emits["update:visible"](false);
};
</script>
