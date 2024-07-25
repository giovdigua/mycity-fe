<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
      <h1 class="text-2xl font-bold text-center">Register</h1>
      <form @submit.prevent="register" class="space-y-4">
        <input
            v-model="name"
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
            v-model="surname"
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
            v-model="email"
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
            v-model="fiscal_code"
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
            v-model="phone_number"
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
            v-model="date_of_birth"
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
        <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="input input-bordered w-full"
        />
        <ul v-if="errors.password" class="text-red-500">
          <li v-for="item in errors.password">
            {{item}}
          </li>
        </ul>
        <input
            v-model="c_password"
            type="password"
            placeholder="Confirm Password"
            required
            class="input input-bordered w-full"
        />
        <ul v-if="errors.c_password" class="text-red-500">
          <li v-for="item in errors.c_password">
            {{item}}
          </li>
        </ul>
        <button type="submit" class="btn btn-primary w-full">
          Register
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
      <p class="text-center">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, toRefs} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const name = ref('');
const surname = ref('');
const email = ref('');
const fiscal_code = ref('');
const phone_number = ref('');
const date_of_birth = ref('');
const password = ref('');
const c_password = ref('');
const errorMessage = ref('');
const errors = ref<{ [key: string]: string }>({});
const authStore = useAuthStore();
const router = useRouter();

const register = async () => {
  errorMessage.value = '';
  try {
    await authStore.register({
      name: name.value,
      surname: surname.value,
      email: email.value,
      fiscal_code: fiscal_code.value,
      phone_number: phone_number.value,
      date_of_birth: date_of_birth.value,
      password: password.value,
      c_password: c_password.value
    });
    localStorage.setItem('email', email.value);
    router.push('/email/verify');
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.data) {
      // const serverErrors = error.response.data.data.error;
      // console.log(serverErrors);
      // for (const keys in serverErrors) {
      //   console.log(keys)
      //   for (const key in keys){
      //     console.log(key)
      //     errors.value[keys] = key;
      //   }
      // }
      // console.log(errors)
      errors.value = error.response.data.data.error;
    } else {
      errorMessage.value = 'An error occurred during registration. Please try again later.';
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>