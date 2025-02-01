<template>
  <UForm 
    :state="formData" 
    class="space-y-6" 
    @submit="handleSubmit"
    :error-behavior="{ initial: false }"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UFormGroup label="Name" name="name" required>
        <UInput
          v-model="formData.name"
          placeholder="e.g., Get User Profile"
        />
      </UFormGroup>

      <UFormGroup label="Method" name="method" required>
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

    <UFormGroup label="Path" name="path" required>
      <UInput
        v-model="formData.path"
        placeholder="/api/v1/users/{id}"
      />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UTextarea
        v-model="formData.description"
        placeholder="Describe what this endpoint does..."
        :ui="{
          base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg',
          padding: {
            md: 'px-3 py-2'
          },
        }"
        :rows="3"
      />
    </UFormGroup>

    <!-- Access Settings -->
    <div class="space-y-4">
      <div>
        <div class="mb-4">
          <h4 class="font-medium">Access Settings</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure whether this endpoint requires a paid subscription to access. Free endpoints can be accessed by all users, while paid endpoints are only available to users with a paid subscription.
          </p>
        </div>

        <div class="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UToggle v-model="formData.isPaid" />
              <span class="text-sm">{{ formData.isPaid ? 'Paid Access' : 'Free Access' }}</span>
            </div>
            <UBadge :color="formData.isPaid ? 'yellow' : 'green'">
              {{ formData.isPaid ? 'Paid Only' : 'Free' }}
            </UBadge>
          </div>
          
          <!-- Request Limit (only for free endpoints) -->
          <template v-if="!formData.isPaid">
            <UFormGroup 
              label="Request Limit" 
              name="requestLimit"
              help="Maximum number of requests allowed per user (set to 0 for unlimited)"
            >
              <UInput
                v-model.number="formData.requestLimit"
                type="number"
                min="0"
                placeholder="e.g., 1000"
              />
            </UFormGroup>
          </template>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formData.isPaid 
              ? 'Paid endpoints allow unlimited requests for subscribed users' 
              : 'Free endpoints can have a request limit to prevent abuse' }}
          </p>
        </div>
      </div>
    </div>

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
            :name="`parameters.${paramIndex}.name`"
            required
          >
            <UInput
              v-model="param.name"
              placeholder="Parameter name"
            />
          </UFormGroup>

          <UFormGroup
            label="Type"
            :name="`parameters.${paramIndex}.type`"
            required
          >
            <USelect
              v-model="param.type"
              :options="parameterTypes"
            />
          </UFormGroup>

          <UFormGroup
            label="Required"
            :name="`parameters.${paramIndex}.required`"
          >
            <UToggle v-model="param.required" />
          </UFormGroup>

          <UFormGroup
            label="Default Value"
            :name="`parameters.${paramIndex}.defaultValue`"
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
  </UForm>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Endpoint, EndpointFormData, Parameter } from '~/types/endpoint'
import { HTTP_METHODS, PARAMETER_TYPES } from '~/types/endpoint'
import { endpointFormSchema } from '~/schemas/endpoint'

const props = defineProps<{
  endpoint?: Endpoint
  isEditing?: boolean
}>()

const httpMethods = [...HTTP_METHODS]
const parameterTypes = [...PARAMETER_TYPES]

const emit = defineEmits<{
  (e: 'submit', endpoint: Endpoint): void
  (e: 'cancel'): void
}>()

const initialFormData: EndpointFormData = {
  name: '',
  method: 'GET',
  path: '',
  description: '',
  parameters: [],
  isPaid: false,
  requestLimit: 1000,
}

const formData = ref<EndpointFormData>(props.endpoint ? { ...props.endpoint } : initialFormData)

const methodColors = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  DELETE: 'red',
  PATCH: 'purple',
} as const

const getMethodColor = (method: string) => methodColors[method as keyof typeof methodColors] || 'gray'

const createEmptyParameter = (): Parameter => ({
  name: '',
  type: 'query',
  required: false,
  description: '',
  defaultValue: '',
})

const addParameter = () => {
  formData.value.parameters.push(createEmptyParameter())
}

const removeParameter = (index: number) => {
  formData.value.parameters.splice(index, 1)
}

const handleSubmit = async () => {
  const result = endpointFormSchema.safeParse(formData.value)
  
  if (!result.success) {
    console.error('Validation failed:', result.error)
    return
  }

  const submissionData: Endpoint = {
    ...formData.value,
    id: formData.value.id || crypto.randomUUID(),
    requestLimit: Number(formData.value.requestLimit)
  }

  emit('submit', submissionData)
}

// Watch isPaid changes and update requestLimit accordingly
watch(() => formData.value.isPaid, (isPaid) => {
  formData.value.requestLimit = isPaid ? 0 : 1000
}, { immediate: true })

const validate = (state: EndpointFormData) => {
  const result = endpointFormSchema.safeParse(state)
  if (!result.success) {
    return result.error.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message
    }))
  }
  return true
}
</script>
