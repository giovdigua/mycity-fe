<template>
  <div>
    <div class="navbar bg-neutral text-neutral-content">
      <div class="flex-1">
        <span class="text-xl">MyCity Test</span>
      </div>
      <div class="flex-none">
        <div class="pr-4">Welcome,  {{ authStore.user ? authStore.user.name : 'user' }}</div>
        <button class="btn btn-primary" @click="logout()">Logout</button>
      </div>
    </div>

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
            <button
                v-if="user?.role === 'admin'"
                class="btn btn-error btn-sm mr-2"
                @click="deleteUser(user.id)"
            >
              Delete
            </button>
            <button
                v-if="user?.role === 'admin'"
                class="btn btn-warning btn-sm"
                @click="updateUser(user.id)"
            >
              Update
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<!--<template>-->
<!--  <div>-->
<!--    <div class="navbar bg-neutral text-neutral-content">-->
<!--      <span class="text-xl">MyCity Test</span>-->
<!--      <button @click="logout()">Logout</button>-->
<!--    </div>-->
<!--    <h1 v-if="authStore.user">Welcome, {{ authStore.user.name }}</h1>-->
<!--    <ul v-if="authStore.users.length > 0">-->
<!--      <li v-for="user in authStore.users" :key="user.id">-->
<!--        {{ user.name }} ({{ user.email }})-->
<!--        <button v-if="user?.role === 'admin'" @click="deleteUser(user.id)">Delete</button>-->
<!--        <button v-if="user?.role === 'admin'" @click="updateUser(user.id)">Update</button>-->
<!--      </li>-->
<!--    </ul>-->
<!--  </div>-->
<!--</template>-->

<script lang="ts" setup>
import { onMounted } from 'vue';
import axios from '../axios';
import { useAuthStore } from '@/store/auth';
import router from "@/router";

const authStore = useAuthStore();

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUsers();
  }
});

const deleteUser = async (id: number) => {
  await axios.delete(`/users/${id}`);
  await authStore.fetchUsers();
};

const updateUser = async (id: number) => {
  const newName = prompt('Enter new name:');
  if (newName) {
    await axios.put(`/users/${id}`, { name: newName });
    await authStore.fetchUsers();
  }
};

const logout = async  () => {
  await authStore.logout();
  await router.push('/login');
}
</script>