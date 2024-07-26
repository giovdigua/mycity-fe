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
    <!--    <button class="btn" @click="">open modal</button>-->
    <!--    <dialog id="my_modal_1" class="modal">-->
    <!--      <div class="modal-box">-->
    <!--        <h3 class="text-lg font-bold">Hello!</h3>-->
    <!--        <p class="py-4">Press ESC key or click the button below to close</p>-->
    <!--        <div class="modal-action">-->
    <!--          <form method="dialog">-->
    <!--            &lt;!&ndash; if there is a button in form, it will close the modal &ndash;&gt;-->
    <!--            <button class="btn">Close</button>-->
    <!--          </form>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </dialog>-->
    <div v-if="authStore.users.length > 0" class="container mx-auto">
      <table class="table w-full mt-12">
        <thead>
        <tr>
          <th>Surname</th>
          <th>Name</th>
          <th>Email</th>
          <th>Fiscal Code</th>
          <th>Phone Number</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in authStore.users" :key="user.id">
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
        <form class="modal-backdrop" method="dialog">
          <div class="flex flex-row">
            <input
                v-model="selectedUser.name"
                type="text"
                placeholder="Name"
                required
                class="input input-bordered w-full"
            />
            <ul v-if="errors.name" class="text-red-500">
              <li v-for="item in errors.name">
                {{item}}
              </li>
            </ul>
            <input
                v-model="selectedUser.surname"
                type="text"
                placeholder="Surname"
                required
                class="input input-bordered w-full"
            />
            <ul v-if="errors.surname" class="text-red-500">
              <li v-for="item in errors.surname">
                {{item}}
              </li>
            </ul>
            <input
                v-model="selectedUser.email"
                type="email"
                placeholder="Email"
                required
                class="input input-bordered w-full"
            />
            <ul v-if="errors.email" class="text-red-500">
              <li v-for="item in errors.email">
                {{item}}
              </li>
            </ul>
            <input
                v-model="selectedUser.fiscal_code"
                type="text"
                placeholder="Fiscal Code"
                required
                class="input input-bordered w-full uppercase"
            />
            <ul v-if="errors.fiscal_code" class="text-red-500">
              <li v-for="item in errors.fiscal_code">
                {{item}}
              </li>
            </ul>
            <input
                v-model="selectedUser.phone_number"
                inputmode="numeric"
                pattern="[0-9]*"
                type="text"
                placeholder="Phone Number"
                required
                class="input input-bordered w-full"
            />
            <ul v-if="errors.phone_number" class="text-red-500">
              <li v-for="item in errors.phone_number">
                {{item}}
              </li>
            </ul>
            <input
                v-model="selectedUser.date_of_birth"
                type="date"
                placeholder="Date of Birth"
                required
                class="input input-bordered w-full"
            />
            <ul v-if="errors.date_of_birth" class="text-red-500">
              <li v-for="item in errors.date_of_birth">
                {{item}}
              </li>
            </ul>
            <button class="btn btn-error mr-1.5" @click="updateUser()">Edit</button>
            <button class="btn btn-active">Cancel</button>
          </div>
        </form>
        <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
      </div>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import {useAuthStore} from '@/store/auth';
import router from "@/router";
import {User} from "@/intrefaces/User";

const authStore = useAuthStore();
const showEditModal = ref();
const showDeleteModal = ref();
const selectedUser = ref<Partial<User>>({});
const errorMessage = ref('');
const errors = ref<{ [key: string]: string }>({});

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUsers();
  }
});

const confirmDelete = (user: User) => {
  selectedUser.value = {...user};
  showDeleteModal.value.showModal();
};
const deleteUser = async (id: number) => {
  await authStore.deleteUser(id);
  await authStore.fetchUsers();
  showDeleteModal.value.close();
  selectedUser.value = {};
};
const editUser = (user: User) => {
  selectedUser.value = { ...user };
  showEditModal.value.showModal();
};
const updateUser = async () => {
  // if (newName) {
  //   await axios.put(`/users/${id}`, {user: newName});
  //   await authStore.fetchUsers();
  // }
};

const logout = async () => {
  await authStore.logout();
  await router.push('/login');
}
</script>