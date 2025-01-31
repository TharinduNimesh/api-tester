<template>
  <div>
    <NuxtLayout name="console">
      <div
        class="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg"
      >
        <!-- Header -->
        <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <h1 class="text-2xl font-semibold">Create New API</h1>
            <p class="text-gray-600 dark:text-zinc-400">
              Configure your API details and endpoints
            </p>
          </div>
          <div class="flex justify-end">
            <UButton
              to="/console/apis"
              color="gray"
              icon="i-heroicons-arrow-left"
            >
              Go Back
            </UButton>
          </div>
        </div>

        <!-- API Form -->
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Basic API Details -->
          <div class="space-y-6">
            <h2 class="text-lg font-medium">Basic Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UFormGroup label="API Name" name="name">
                <UInput v-model="apiData.name" placeholder="Enter API name" />
              </UFormGroup>

              <UFormGroup label="Base URL" name="baseUrl">
                <UInput
                  v-model="apiData.baseUrl"
                  placeholder="https://api.example.com/v1"
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Description" name="description">
              <UTextarea
                v-model="apiData.description"
                placeholder="Describe your API"
              />
            </UFormGroup>
          </div>

          <!-- Endpoints Section -->
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium">Endpoints</h2>
            </div>

            <!-- Endpoints List -->
            <EndpointList
              :endpoints="apiData.endpoints"
              @add="openEndpointModal"
              @edit="editEndpoint"
              @delete="confirmDeleteEndpoint"
            />

            <!-- Endpoint Modal -->
            <UModal v-model="isEndpointModalOpen" :ui="{ width: 'w-full sm:max-w-4xl' }">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-semibold">
                    {{
                      editingEndpointIndex === null
                        ? "Add New Endpoint"
                        : "Edit Endpoint"
                    }}
                  </h3>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark"
                    size="sm"
                    @click="isEndpointModalOpen = false"
                  />
                </div>

                <EndpointForm
                  :endpoint="currentEndpoint"
                  :is-editing="editingEndpointIndex !== null"
                  @submit="saveEndpoint"
                  @cancel="isEndpointModalOpen = false"
                />
              </div>
            </UModal>

            <!-- Delete Confirmation Modal -->
            <UModal v-model="isDeleteModalOpen">
              <div class="p-6">
                <h3 class="text-lg font-medium mb-4">Delete Endpoint</h3>
                <p class="text-gray-500 mb-6">
                  Are you sure you want to delete this endpoint? This action
                  cannot be undone.
                </p>
                <div class="flex justify-end space-x-3">
                  <UButton color="gray" @click="isDeleteModalOpen = false">
                    Cancel
                  </UButton>
                  <UButton color="red" @click="deleteEndpoint"> Delete </UButton>
                </div>
              </div>
            </UModal>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <UButton to="/console/apis" color="gray"> Cancel </UButton>
            <UButton type="submit" color="black"> Create API </UButton>
          </div>
        </form>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
interface Parameter {
  name: string;
  type: "query" | "body" | "header" | "path";
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  parameters: Parameter[];
  description: string;
}

interface API {
  id?: string;
  name: string;
  baseUrl: string;
  description: string;
  endpoints: Endpoint[];
}

const apiStore = useApiStore();
const router = useRouter();

const apiData = ref<API>({
  name: "",
  baseUrl: "",
  description: "",
  endpoints: [],
});

function createEndpoint(): Endpoint {
  return {
    id: crypto.randomUUID(),
    name: "",
    path: "",
    method: "GET",
    parameters: [],
    description: "",
  };
}

function createParameter(): Parameter {
  return {
    name: "",
    type: "query",
    required: false,
    description: "",
    defaultValue: "",
  };
}

const isEndpointModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editingEndpointIndex = ref<number | null>(null);
const deletingEndpointIndex = ref<number | null>(null);
const currentEndpoint = ref<Endpoint>(createEndpoint());

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
const parameterTypes = ["query", "body", "header", "path"] as const;

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

function openEndpointModal() {
  editingEndpointIndex.value = null;
  currentEndpoint.value = createEndpoint();
  isEndpointModalOpen.value = true;
}

function editEndpoint(index: number) {
  editingEndpointIndex.value = index;
  currentEndpoint.value = JSON.parse(
    JSON.stringify(apiData.value.endpoints[index])
  );
  isEndpointModalOpen.value = true;
}

function confirmDeleteEndpoint(index: number) {
  deletingEndpointIndex.value = index;
  isDeleteModalOpen.value = true;
}

function deleteEndpoint() {
  if (deletingEndpointIndex.value !== null) {
    apiData.value.endpoints.splice(deletingEndpointIndex.value, 1);
    deletingEndpointIndex.value = null;
    isDeleteModalOpen.value = false;
  }
}

function saveEndpoint(endpoint: Endpoint) {
  if (editingEndpointIndex.value === null) {
    // Add new endpoint
    apiData.value.endpoints.push(endpoint);
  } else {
    // Update existing endpoint
    apiData.value.endpoints[editingEndpointIndex.value] = endpoint;
  }

  isEndpointModalOpen.value = false;
  editingEndpointIndex.value = null;
  currentEndpoint.value = createEndpoint();
}

async function handleSubmit() {
  try {
    // Add the new API to the store
    const newApi = apiStore.addApi(apiData.value);
    console.log("API created successfully:", newApi);

    // Show success message
    const toast = useToast();
    toast.add({
      title: "Success",
      description: "API created successfully",
      color: "green",
    });

    // Navigate back to the APIs list
    await router.push("/console/apis");
  } catch (error) {
    console.error("Error creating API:", error);
    // Show error message
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Failed to create API",
      color: "red",
    });
  }
}
</script>
