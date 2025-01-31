<!-- EndpointForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UFormGroup label="Name" name="endpoint-name" required>
        <UInput
          v-model="formData.name"
          placeholder="e.g., Get User Profile"
        />
      </UFormGroup>

      <UFormGroup label="Method" name="endpoint-method" required>
        <USelect
          v-model="formData.method"
          :options="httpMethods"
          :ui="{
            option: {
              base: 'relative flex items-center gap-2 px-3 py-2 cursor-pointer',
              active: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
              selected: 'bg-gray-100 dark:bg-gray-800',
              icon: {
                base: 'flex-shrink-0 h-4 w-4',
                active: 'text-gray-900 dark:text-white',
                inactive: 'text-gray-400 dark:text-gray-500',
              },
            },
          }"
        >
          <template #option="{ option }">
            <UBadge :color="getMethodColor(option)">{{ option }}</UBadge>
          </template>
        </USelect>
      </UFormGroup>
    </div>

    <UFormGroup label="Path" name="endpoint-path" required>
      <UInput
        v-model="formData.path"
        placeholder="/api/v1/users/{id}"
      />
    </UFormGroup>

    <UFormGroup label="Description" name="endpoint-description">
      <UTextarea
        v-model="formData.description"
        placeholder="Describe what this endpoint does..."
        :ui="{
          base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg',
          padding: 'px-3 py-2',
        }"
        rows="3"
      />
    </UFormGroup>

    <!-- Parameters Section -->
    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <div>
          <h4 class="font-medium">Parameters</h4>
          <p class="text-sm text-gray-500">
            Define the parameters required by this endpoint
          </p>
        </div>
        <UButton
          color="black"
          variant="soft"
          size="sm"
          icon="i-heroicons-plus-small"
          @click.prevent="addParameter"
        >
          Add Parameter
        </UButton>
      </div>

      <div
        v-if="formData.parameters.length === 0"
        class="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <UIcon
          name="i-heroicons-squares-plus"
          class="w-8 h-8 text-gray-400 mx-auto mb-2"
        />
        <p class="text-gray-500 text-sm">No parameters added yet</p>
      </div>

      <TransitionGroup name="list" tag="div" class="space-y-4">
        <div
          v-for="(param, paramIndex) in formData.parameters"
          :key="paramIndex"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg relative group"
        >
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            size="xs"
            class="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.prevent="removeParameter(paramIndex)"
          />

          <UFormGroup
            label="Name"
            :name="'param-name-' + paramIndex"
            required
          >
            <UInput
              v-model="param.name"
              placeholder="Parameter name"
            />
          </UFormGroup>

          <UFormGroup
            label="Type"
            :name="'param-type-' + paramIndex"
            required
          >
            <USelect
              v-model="param.type"
              :options="parameterTypes"
            />
          </UFormGroup>

          <UFormGroup
            label="Required"
            :name="'param-required-' + paramIndex"
          >
            <UToggle v-model="param.required" />
          </UFormGroup>

          <UFormGroup
            label="Default Value"
            :name="'param-default-' + paramIndex"
          >
            <UInput
              v-model="param.defaultValue"
              placeholder="Default value"
            />
          </UFormGroup>
        </div>
      </TransitionGroup>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t dark:border-gray-700">
      <UButton color="gray" @click="$emit('cancel')">Cancel</UButton>
      <UButton type="submit" color="black">
        {{ isEditing ? "Save Changes" : "Add Endpoint" }}
      </UButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Endpoint, Parameter } from '~/types';

const props = defineProps<{
  endpoint?: Endpoint;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', endpoint: Endpoint): void;
  (e: 'cancel'): void;
}>();

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
const parameterTypes = ["query", "body", "header", "path"] as const;

const formData = ref<Endpoint>(
  props.endpoint ? 
    JSON.parse(JSON.stringify(props.endpoint)) : 
    {
      id: crypto.randomUUID(),
      name: '',
      method: 'GET',
      path: '',
      description: '',
      parameters: [],
    }
);

function getMethodColor(method: string): string {
  const colors = {
    GET: "green",
    POST: "blue",
    PUT: "orange",
    DELETE: "red",
    PATCH: "purple",
  };
  return colors[method as keyof typeof colors] || "gray";
}

function addParameter() {
  formData.value.parameters.push({
    name: '',
    type: 'query',
    required: false,
    defaultValue: '',
  });
}

function removeParameter(index: number) {
  formData.value.parameters.splice(index, 1);
}

function handleSubmit() {
  if (!formData.value.name || !formData.value.path) {
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Name and path are required",
      color: "red",
    });
    return;
  }

  emit('submit', JSON.parse(JSON.stringify(formData.value)));
}
</script>
