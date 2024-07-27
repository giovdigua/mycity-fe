<template>
  <div>
    <div class="navbar bg-neutral text-neutral-content">
      <div class="flex-1">
        <span class="text-xl">MyCity Test</span>
      </div>
      <div class="flex-none">
        <div class="pr-4">Welcome, {{ authStore.user ? authStore.user.name : 'user' }}</div>
        <button class="btn btn-primary" @click="logout()">Logout</button>
      </div>
    </div>
    <div v-if="authStore.usersPaginator.data.length > 0" class="container mx-auto">
      <table class="table w-full mt-12">
        <thead>
        <tr>
          <th>
            <button @click="toggleSortOrder" class="flex items-center">
              Surname
              <span v-if="sortOrder === 'asc'" class="ml-2">▲</span>
              <span v-if="sortOrder === 'desc'" class="ml-2">▼</span>
              <span v-if="sortOrder === null" class="ml-2">↕</span>
            </button>
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Fiscal Code</th>
          <th>Phone Number</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in authStore.usersPaginator.data" :key="user.id">
          <td>{{ user.surname }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.fiscal_code }}</td>
          <td>{{ user.phone_number }}</td>
          <td>{{ user.role }}</td>
          <td>
            <template v-if="user.id !== authStore.user?.id && authStore.user?.role === 'admin'">
              <button
                  v-if="user?.role !== 'admin'"
                  class="btn btn-error btn-sm mr-2"
                  @click="confirmDelete(user)"
              >
                Delete
              </button>
              <button
                  v-if="user?.role !== 'admin'"
                  class="btn btn-warning btn-sm"
                  @click="editUser(user)"
              >
                Update
              </button>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <TailwindPagination
        :data="authStore.usersPaginator"
        :limit="8"
        @pagination-change-page="fetchUsers"
    >
    <template #prev-nav>
      <button class="btn btn-primary" :disabled="!authStore.usersPaginator.prev_page_url">
        Prev
      </button>
    </template>
    <template #next-nav>
      <button class="btn btn-primary" :disabled="!authStore.usersPaginator.next_page_url">
        Next
      </button>
    </template>
    </TailwindPagination>
    <dialog ref="showDeleteModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Confirm Delete</h3>
        <p class="py-4">Are you sure you want to delete {{ selectedUser.name }}?</p>
        <form class="flex flex-row  justify-end modal-backdrop" method="dialog">
          <button class="btn btn-error mr-1.5" @click="deleteUser(selectedUser.id!)">Yes</button>
          <button class="btn btn-active">No</button>
        </form>
      </div>
    </dialog>

    <dialog ref="showEditModal" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Edit User</h3>
        <form @submit.prevent="updateUser" class="modal-backdrop gap-3" method="dialog">
          <label class="input input-bordered flex items-center gap-2 text-gray-400">
            Name:
            <input
                v-model="selectedUser.name"
                type="text"
                placeholder="Name"
                required
                class="grow text-gray-800"
            />
          </label>
          <ul v-if="errors.name" class="mx-4 text-red-500">
              <li v-for="item in errors.name">
                {{item}}
              </li>
            </ul>

          <label class="input input-bordered flex items-center gap-2 text-gray-400">
            Surname:
            <input
                v-model="selectedUser.surname"
                type="text"
                placeholder="Surname"
                required
                class="grow text-gray-800"
            />
          </label>
          <ul v-if="errors.surname" class="text-red-500">
            <li v-for="item in errors.surname">
              {{ item }}
            </li>
          </ul>

          <label class="input input-bordered flex items-center gap-2 text-gray-400">
            Email:
            <input
                v-model="selectedUser.email"
                type="text"
                placeholder="Email"
                required
                class="grow text-gray-800"
            />
          </label>
          <ul v-if="errors.email" class="text-red-500">
            <li v-for="item in errors.email">
              {{ item }}
            </li>
          </ul>

          <label class="input input-bordered flex items-center gap-2 text-gray-400">
            Fiscal Code:
            <input
                v-model="selectedUser.fiscal_code"
                type="text"
                placeholder="Fiscal Code"
                required
                class="grow text-gray-800"
            />
          </label>
          <ul v-if="errors.fiscal_code" class="my-4 text-red-500">
            <li v-for="item in errors.fiscal_code">
              {{ item }}
            </li>
          </ul>

          <label class="input input-bordered flex items-center gap-2 text-gray-400">
            Phone Number:
            <input
                v-model="selectedUser.phone_number"
                type="text"
                placeholder="Phone Number"
                required
                class="grow text-gray-800"
            />
          </label>
          <ul v-if="errors.phone_number" class="text-red-500">
            <li v-for="item in errors.phone_number">
              {{ item }}
            </li>
          </ul>

          <label class="input input-bordered flex items-center gap-2 text-gray-400">
            Date of Birth:
            <input
                v-model="selectedUser.date_of_birth"
                type="date"
                placeholder="Fiscal Code"
                required
                class="grow text-gray-800"
            />
          </label>
          <ul v-if="errors.date_of_birth" class="text-red-500">
            <li v-for="item in errors.date_of_birth">
              {{ item }}
            </li>
          </ul>

          <div class="flex flex-row justify-end">
            <button class="btn btn-error mr-1.5" @click="updateUser()">Edit</button>
            <button class="btn btn-active" @click="closeUpdateUser()">Cancel</button>
          </div>
        </form>
        <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
      </div>
    </dialog>
  </div>
  <div v-if="showToast" class="toast toast-end">
    <div class="alert alert-success">
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {TailwindPagination} from 'laravel-vue-pagination';
import {onMounted, ref} from 'vue';
import {useAuthStore} from '@/store/auth';
import router from "@/router";
import {User} from "@/intrefaces/User";

const authStore = useAuthStore();
const showEditModal = ref();
const showDeleteModal = ref();
const showToast = ref(false);
const toastMessage = ref('');
const selectedUser = ref<Partial<User>>({});
const errorMessage = ref('');
const errors = ref<{ [key: string]: string }>({});
const sortOrder = ref<string | null>(null);
const currentPage = ref(1);

onMounted(() => {
  if (authStore.token) {
    fetchUsers();
  }
});
const fetchUsers = async (page = 1) => {
  currentPage.value = page;
  await authStore.fetchUsers(page,sortOrder.value)
};
const confirmDelete = (user: User) => {
  selectedUser.value = {...user};
  showDeleteModal.value.showModal();
};
const deleteUser = async (id: number) => {
  await authStore.deleteUser(id);
  await fetchUsers(currentPage.value);
  showDeleteModal.value.close();
  selectedUser.value = {};
  errors.value = {};
  showToastAlert('User deleted successfully!');
};

const closeUpdateUser = () => {
  selectedUser.value = {};
  errors.value = {};
  showEditModal.value.close();
};
const editUser = (user: User) => {
  selectedUser.value = { ...user };
  showEditModal.value.showModal();
};
const updateUser = async () => {
  try {
    await authStore.updateUser(selectedUser.value);
    await fetchUsers(currentPage.value);
    selectedUser.value = {};
    errors.value = {};
    showEditModal.value.close();
    showToastAlert('User updated successfully!');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.data) {
      errors.value = error.response.data.data.error;
    } else {
      errorMessage.value = 'An error occurred during registration. Please try again later.';
    }
  }
};

const logout = async () => {
  await authStore.logout();
  await router.push('/login');
}

const showToastAlert = (message:string) => {
  toastMessage.value = message;
  showToast.value = true
  setTimeout(()=>{
    toastMessage.value = '';
    showToast.value = false
  },5000);
}

const toggleSortOrder = async () => {
  if (sortOrder.value === null) {
    sortOrder.value = 'asc';
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc';
  } else if (sortOrder.value === 'desc') {
    sortOrder.value = null;
  }
  fetchUsers(currentPage.value);
};
</script>