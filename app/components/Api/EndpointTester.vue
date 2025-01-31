<template>
  <USlideover
    v-model="isOpen"
    :prevent-close="loading"
    class=""
  >
    <UCard class="flex flex-col h-full">
      <!-- <template #header>
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <UBadge
              :color="getMethodColor(endpoint.method)"
              class="uppercase font-mono"
            >
              {{ endpoint.method }}
            </UBadge>
            <code
              class="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
            >
              {{ endpoint.path }}
            </code>
          </div>
          <h3 class="text-xl font-semibold">{{ endpoint.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ endpoint.description }}
          </p>
          <div class="flex items-center gap-2 mt-2">
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">
              Base URL:
            </div>
            <code
              class="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
            >
              {{ baseUrl }}
            </code>
          </div>
        </div>
      </template> -->

      <template #default>
        <div class="space-y-8">
          <template v-for="(params, type) in formattedParams" :key="type">
            <div v-if="params.length" class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="font-medium capitalize">{{ type }} Parameters</h4>
                <UBadge size="sm" color="gray">{{ params.length }}</UBadge>
              </div>

              <div
                class="space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
              >
                <div
                  v-for="param in params"
                  :key="param.name"
                  class="space-y-2"
                >
                  <UFormGroup :label="param.name" :required="param.required">
                    <template v-if="type === 'body'">
                      <UTextarea
                        v-model="paramValues[param.name]"
                        :placeholder="param.defaultValue"
                        :rows="5"
                        class="font-mono text-sm"
                        variant="outline"
                      >
                        <template #help>
                          <div class="flex items-center justify-between">
                            <span>{{ param.description }}</span>
                            <UButton
                              size="xs"
                              variant="ghost"
                              icon="i-heroicons-arrow-path"
                              @click="resetParam(param.name)"
                            >
                              Reset
                            </UButton>
                          </div>
                        </template>
                      </UTextarea>
                    </template>
                    <template v-else>
                      <UInput
                        v-model="paramValues[param.name]"
                        :placeholder="param.defaultValue"
                        variant="outline"
                        class="font-mono"
                        :type="getInputType(param)"
                      >
                        <template #trailing v-if="paramValues[param.name]">
                          <UButton
                            size="2xs"
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-x-mark"
                            @click="paramValues[param.name] = ''"
                          />
                        </template>
                      </UInput>
                    </template>
                  </UFormGroup>
                </div>
              </div>
            </div>
          </template>

          <!-- Response Section -->
          <template v-if="response">
            <UDivider />
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="font-medium">Response</h4>
                <div class="flex items-center gap-3">
                  <UBadge :color="response.status < 400 ? 'success' : 'danger'">
                    Status {{ response.status }}
                  </UBadge>
                  <span class="text-sm text-gray-500"
                    >{{ response.time }}ms</span
                  >
                </div>
              </div>
              <div
                class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 overflow-hidden"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-gray-500">Response Body</span>
                  <UButton
                    size="xs"
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-clipboard"
                    @click="copyResponse"
                  >
                    Copy
                  </UButton>
                </div>
                <pre class="text-sm font-mono overflow-x-auto">{{
                  JSON.stringify(response.data, null, 2)
                }}</pre>
              </div>
            </div>
          </template>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between gap-3 w-full">
          <UButton
            color="gray"
            variant="ghost"
            @click="isOpen = false"
            :disabled="loading"
          >
            Close
          </UButton>
          <UButton
            color="black"
            :loading="loading"
            :disabled="hasValidationErrors"
            @click="sendRequest"
            :icon="
              loading ? 'i-heroicons-arrow-path' : 'i-heroicons-paper-airplane'
            "
          >
            Send Request
          </UButton>
        </div>
      </template>
    </UCard>
  </USlideover>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

interface Parameter {
  name: string;
  type: "query" | "body" | "header" | "path";
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface Props {
  baseUrl: string;
  endpoint: {
    id: string;
    name: string;
    path: string;
    method: string;
    parameters: Parameter[];
    description: string;
  };
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loading = ref(false);
const paramValues = ref<Record<string, string>>({});
const response = ref<{ status: number; time: number; data: any } | null>(null);

const { copy } = useClipboard();

const hasValidationErrors = computed(() => {
  return Object.entries(formattedParams.value).some(([_, params]) => {
    return params.some(
      (param) => param.required && !paramValues.value[param.name]
    );
  });
});

const getInputType = (param: Parameter) => {
  if (param.name.toLowerCase().includes("email")) return "email";
  if (param.name.toLowerCase().includes("password")) return "password";
  if (param.defaultValue && !isNaN(Number(param.defaultValue))) return "number";
  return "text";
};

const resetParam = (paramName: string) => {
  const param = props.endpoint.parameters.find((p) => p.name === paramName);
  if (param?.defaultValue) {
    paramValues.value[paramName] = param.defaultValue;
  } else {
    paramValues.value[paramName] = "";
  }
};

const copyResponse = async () => {
  if (!response.value) return;
  await copy(JSON.stringify(response.value.data, null, 2));
  toast.add({
    title: "Copied to clipboard",
    description: "Response has been copied to your clipboard",
    icon: "i-heroicons-check-circle",
    timeout: 2000,
  });
};

// Group parameters by type
const formattedParams = computed(() => {
  return {
    path: props.endpoint.parameters.filter((p) => p.type === "path"),
    query: props.endpoint.parameters.filter((p) => p.type === "query"),
    header: props.endpoint.parameters.filter((p) => p.type === "header"),
    body: props.endpoint.parameters.filter((p) => p.type === "body"),
  };
});

const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    GET: "green",
    POST: "blue",
    PUT: "orange",
    DELETE: "red",
    PATCH: "yellow",
  };
  return colors[method] || "gray";
};

// Initialize param values with default values
watch(
  () => props.endpoint,
  () => {
    const values: Record<string, string> = {};
    props.endpoint.parameters.forEach((param) => {
      if (param.defaultValue) {
        values[param.name] = param.defaultValue;
      }
    });
    paramValues.value = values;
  },
  { immediate: true }
);

const sendRequest = async () => {
  loading.value = true;
  response.value = null;

  try {
    const startTime = Date.now();
    // Implement your API call logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay

    // Simulate response
    response.value = {
      status: 200,
      time: Date.now() - startTime,
      data: { success: true, message: "Request successful" },
    };
  } catch (error: any) {
    response.value = {
      status: error.status || 500,
      time: Date.now() - startTime,
      data: error.message || "Request failed",
    };
  } finally {
    loading.value = false;
  }
};
</script>
